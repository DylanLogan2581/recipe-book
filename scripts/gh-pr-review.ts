#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const DEFAULT_POLL_INTERVAL_SECONDS = 30;
const DEFAULT_CHECKS_INTERVAL_SECONDS = 10;
const REPOSITORY_OVERRIDE_ENV = "GH_PR_REVIEW_REPO";

type CommandResult = {
  status: number | null;
  stderr: string;
  stdout: string;
};

type GitHubReviewDecision =
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "REVIEW_REQUIRED"
  | null;

type ReviewRequestNode = {
  requestedReviewer: RequestedReviewer | null;
};

type RequestedReviewer =
  | {
      __typename: "Bot" | "Mannequin" | "User";
      login: string;
    }
  | {
      __typename: "Team";
      organization: {
        login: string;
      };
      slug: string;
    };

type ReviewNode = {
  author: {
    login: string;
  } | null;
};

type ReviewCommentNode = {
  author: {
    login: string;
  } | null;
  body: string;
  line: number | null;
  path: string | null;
  url: string;
};

type ReviewThreadNode = {
  comments: {
    nodes: ReviewCommentNode[];
  };
  id: string;
  isOutdated: boolean;
  isResolved: boolean;
};

type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

type PullRequestReviewStateResponse = {
  data: {
    repository: {
      pullRequest: {
        reviewRequests: {
          nodes: ReviewRequestNode[];
          pageInfo: PageInfo;
        };
        title: string;
        url: string;
      } | null;
    } | null;
  };
};

type PullRequestThreadResponse = {
  data: {
    repository: {
      pullRequest: {
        reviewThreads: {
          nodes: ReviewThreadNode[];
          pageInfo: PageInfo;
        };
      } | null;
    } | null;
  };
};

type PullRequestPendingReviewsResponse = {
  data: {
    repository: {
      pullRequest: {
        reviewDecision: GitHubReviewDecision;
        reviews: {
          nodes: ReviewNode[];
          pageInfo: PageInfo;
        };
        title: string;
        url: string;
      } | null;
    } | null;
  };
};

type PullRequestReviewState = {
  pendingReviewAuthors: string[];
  requestedReviewers: string[];
  reviewDecision: GitHubReviewDecision;
  title: string;
  url: string;
};

type ReviewThreadSummary = {
  author: string;
  body: string;
  isOutdated: boolean;
  line: number | null;
  path: string | null;
  url: string;
};

type RepositoryCoordinates = {
  name: string;
  owner: string;
  value: string;
};

async function main(): Promise<void> {
  ensureCommand("git");
  ensureCommand("gh");

  const pullRequestNumber = parsePullRequestNumber(process.argv.slice(2));
  const repository = inferRepositoryCoordinates();

  writeLine(
    `Watching checks for PR #${pullRequestNumber} in ${repository.value}...`,
  );
  const checksStatus = watchPullRequestChecks(
    repository.value,
    pullRequestNumber,
  );

  if (checksStatus === 0) {
    writeLine("Checks finished.");
  } else if (checksStatus === 1) {
    writeLine("Checks finished with failures. Review polling will continue.");
    process.exitCode = 1;
  } else {
    writeLine(
      `Checks exited with status ${String(checksStatus)}. Review polling will continue.`,
    );
    process.exitCode = checksStatus;
  }

  const reviewState = await waitForReviewsToFinish(
    repository,
    pullRequestNumber,
    DEFAULT_POLL_INTERVAL_SECONDS,
  );

  writeLine("");
  writeLine(`Review polling finished for ${reviewState.title}`);
  writeLine(reviewState.url);

  const unresolvedThreads = fetchUnresolvedReviewThreads(
    repository,
    pullRequestNumber,
  );

  if (unresolvedThreads.length > 0) {
    printUnresolvedThreads(unresolvedThreads);
    printFollowUpInstructions(pullRequestNumber);
    process.exitCode = 1;
    return;
  }

  if (reviewState.reviewDecision === "APPROVED") {
    writeLine("");
    writeLine("Approved with no unresolved review threads.");
    return;
  }

  writeLine("");
  writeLine("No unresolved review threads were found.");
  writeLine(
    `Current review decision: ${reviewState.reviewDecision ?? "none available"}.`,
  );
}

function parsePullRequestNumber(args: string[]): number {
  const rawValue = args.at(0);

  if (rawValue === undefined || rawValue.length === 0) {
    throw new Error(
      "Missing pull request number. Usage: npm run gh-pr-review -- 37",
    );
  }

  const pullRequestNumber = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(pullRequestNumber) || pullRequestNumber <= 0) {
    throw new Error(`Invalid pull request number: ${rawValue}`);
  }

  return pullRequestNumber;
}

function inferRepositoryCoordinates(): RepositoryCoordinates {
  const override = process.env[REPOSITORY_OVERRIDE_ENV];

  if (override !== undefined && override.length > 0) {
    return parseRepositoryCoordinates(override);
  }

  const remoteUrl = runCommand("git", [
    "remote",
    "get-url",
    "origin",
  ]).stdout.trim();

  return parseRepositoryCoordinates(remoteUrl);
}

function parseRepositoryCoordinates(value: string): RepositoryCoordinates {
  const trimmedValue = value.trim();
  const plainMatch = trimmedValue.match(
    /^(?<owner>[^/\s]+)\/(?<repo>[^/\s]+)$/,
  );
  const remoteMatch = trimmedValue.match(
    /github\.com[:/](?<owner>[^/\s]+)\/(?<repo>[^/\s]+?)(?:\.git)?$/,
  );
  const match = plainMatch ?? remoteMatch;

  if (match?.groups?.owner === undefined || match.groups.repo === undefined) {
    throw new Error(
      `Unable to infer GitHub repository from "${trimmedValue}". Set ${REPOSITORY_OVERRIDE_ENV}=OWNER/REPO if needed.`,
    );
  }

  return {
    name: match.groups.repo,
    owner: match.groups.owner,
    value: `${match.groups.owner}/${match.groups.repo}`,
  };
}

function watchPullRequestChecks(
  repository: string,
  pullRequestNumber: number,
): number {
  const result = spawnSync(
    "gh",
    [
      "pr",
      "checks",
      String(pullRequestNumber),
      "--repo",
      repository,
      "--watch",
      "--interval",
      String(DEFAULT_CHECKS_INTERVAL_SECONDS),
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "inherit",
    },
  );

  if (result.error !== undefined && result.status === null) {
    throw result.error;
  }

  return result.status ?? 1;
}

async function waitForReviewsToFinish(
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
  pollIntervalSeconds: number,
): Promise<PullRequestReviewState> {
  for (;;) {
    const reviewState = fetchPullRequestReviewState(
      repository,
      pullRequestNumber,
    );

    if (
      reviewState.pendingReviewAuthors.length === 0 &&
      reviewState.requestedReviewers.length === 0
    ) {
      return reviewState;
    }

    writeLine("");
    writeLine("Waiting for reviews to finish...");

    if (reviewState.requestedReviewers.length > 0) {
      writeLine(
        `Outstanding review requests: ${reviewState.requestedReviewers.join(", ")}`,
      );
    }

    if (reviewState.pendingReviewAuthors.length > 0) {
      writeLine(
        `Pending draft reviews: ${reviewState.pendingReviewAuthors.join(", ")}`,
      );
    }

    writeLine(`Checking again in ${String(pollIntervalSeconds)} seconds.`);
    await delay(pollIntervalSeconds * 1000);
  }
}

function fetchPullRequestReviewState(
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
): PullRequestReviewState {
  const requestedReviewers = new Set<string>();
  let reviewRequestsCursor: string | null = null;
  let title = "";
  let url = "";

  for (;;) {
    const response = queryReviewRequests(
      REVIEW_REQUESTS_QUERY,
      repository,
      pullRequestNumber,
      {
        reviewRequestsCursor,
      },
    );
    const pullRequest = response.data.repository?.pullRequest;

    if (pullRequest === null || pullRequest === undefined) {
      throw new Error(
        `Pull request #${String(pullRequestNumber)} was not found.`,
      );
    }

    for (const node of pullRequest.reviewRequests.nodes) {
      const reviewer = formatRequestedReviewer(node.requestedReviewer);

      if (reviewer !== null) {
        requestedReviewers.add(reviewer);
      }
    }

    if (!pullRequest.reviewRequests.pageInfo.hasNextPage) {
      break;
    }

    reviewRequestsCursor = pullRequest.reviewRequests.pageInfo.endCursor;
  }

  const pendingReviewAuthors = new Set<string>();
  let reviewsCursor: string | null = null;
  let reviewDecision: GitHubReviewDecision = null;

  for (;;) {
    const response = queryPendingReviews(
      PENDING_REVIEWS_QUERY,
      repository,
      pullRequestNumber,
      {
        reviewsCursor,
      },
    );
    const pullRequest = response.data.repository?.pullRequest;

    if (pullRequest === null || pullRequest === undefined) {
      throw new Error(
        `Pull request #${String(pullRequestNumber)} was not found.`,
      );
    }

    title = pullRequest.title;
    url = pullRequest.url;
    reviewDecision = pullRequest.reviewDecision;

    for (const node of pullRequest.reviews.nodes) {
      const authorLogin = node.author?.login;

      if (authorLogin !== undefined && authorLogin.length > 0) {
        pendingReviewAuthors.add(authorLogin);
      }
    }

    if (!pullRequest.reviews.pageInfo.hasNextPage) {
      break;
    }

    reviewsCursor = pullRequest.reviews.pageInfo.endCursor;
  }

  return {
    pendingReviewAuthors: [...pendingReviewAuthors].sort(localeCompareStrings),
    requestedReviewers: [...requestedReviewers].sort(localeCompareStrings),
    reviewDecision,
    title,
    url,
  };
}

function fetchUnresolvedReviewThreads(
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
): ReviewThreadSummary[] {
  const unresolvedThreads: ReviewThreadSummary[] = [];
  let cursor: string | null = null;

  for (;;) {
    const response = queryReviewThreads(
      REVIEW_THREADS_QUERY,
      repository,
      pullRequestNumber,
      {
        threadsCursor: cursor,
      },
    );
    const pullRequest = response.data.repository?.pullRequest;

    if (pullRequest === null || pullRequest === undefined) {
      throw new Error(
        `Pull request #${String(pullRequestNumber)} was not found.`,
      );
    }

    for (const thread of pullRequest.reviewThreads.nodes) {
      if (thread.isResolved) {
        continue;
      }

      const lastComment = thread.comments.nodes.at(-1);

      unresolvedThreads.push({
        author: lastComment?.author?.login ?? "unknown",
        body: lastComment?.body ?? "(no comment body available)",
        isOutdated: thread.isOutdated,
        line: lastComment?.line ?? null,
        path: lastComment?.path ?? null,
        url: lastComment?.url ?? "",
      });
    }

    if (!pullRequest.reviewThreads.pageInfo.hasNextPage) {
      break;
    }

    cursor = pullRequest.reviewThreads.pageInfo.endCursor;
  }

  unresolvedThreads.sort((left, right) => {
    const pathCompareResult = localeCompareStrings(
      left.path ?? "",
      right.path ?? "",
    );

    if (pathCompareResult !== 0) {
      return pathCompareResult;
    }

    return (left.line ?? 0) - (right.line ?? 0);
  });

  return unresolvedThreads;
}

function printUnresolvedThreads(threads: ReviewThreadSummary[]): void {
  writeLine("");
  writeLine(
    `Found ${String(threads.length)} unresolved review thread${threads.length === 1 ? "" : "s"}:`,
  );

  for (const [index, thread] of threads.entries()) {
    const location = formatThreadLocation(thread.path, thread.line);
    const outdatedSuffix = thread.isOutdated ? " [outdated]" : "";

    writeLine("");
    writeLine(`${String(index + 1)}. ${location}${outdatedSuffix}`);
    writeLine(`Reviewer: ${thread.author}`);
    writeLine(`Comment: ${normalizeWhitespace(thread.body)}`);

    if (thread.url.length > 0) {
      writeLine(`Link: ${thread.url}`);
    }
  }
}

function printFollowUpInstructions(pullRequestNumber: number): void {
  writeLine("");
  writeLine("Next steps:");
  writeLine("1. Address the unresolved review thread feedback above.");
  writeLine("2. Commit and push your fixes to the PR branch.");
  writeLine(
    `3. Run npm run gh-pr-review -- ${String(pullRequestNumber)} again.`,
  );
}

function formatRequestedReviewer(
  reviewer: RequestedReviewer | null,
): string | null {
  if (reviewer === null) {
    return null;
  }

  switch (reviewer.__typename) {
    case "Bot":
    case "Mannequin":
    case "User":
      return reviewer.login;
    case "Team":
      return `${reviewer.organization.login}/${reviewer.slug}`;
  }
}

function formatThreadLocation(
  path: string | null,
  line: number | null,
): string {
  if (path === null) {
    return "Unknown location";
  }

  if (line === null) {
    return path;
  }

  return `${path}:${String(line)}`;
}

function normalizeWhitespace(value: string): string {
  return value.replaceAll(/\s+/g, " ").trim();
}

function localeCompareStrings(left: string, right: string): number {
  return left.localeCompare(right);
}

function ensureCommand(command: string): void {
  try {
    execFileSync("bash", ["-lc", `command -v ${command}`], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "ignore",
    });
  } catch {
    throw new Error(`Required command not found: ${command}`);
  }
}

function queryReviewRequests(
  query: string,
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
  variables: Record<string, string | number | null>,
): PullRequestReviewStateResponse {
  const result = runGraphQlCommand(
    query,
    repository,
    pullRequestNumber,
    variables,
  );

  return JSON.parse(result.stdout) as PullRequestReviewStateResponse;
}

function queryPendingReviews(
  query: string,
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
  variables: Record<string, string | number | null>,
): PullRequestPendingReviewsResponse {
  const result = runGraphQlCommand(
    query,
    repository,
    pullRequestNumber,
    variables,
  );

  return JSON.parse(result.stdout) as PullRequestPendingReviewsResponse;
}

function queryReviewThreads(
  query: string,
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
  variables: Record<string, string | number | null>,
): PullRequestThreadResponse {
  const result = runGraphQlCommand(
    query,
    repository,
    pullRequestNumber,
    variables,
  );

  return JSON.parse(result.stdout) as PullRequestThreadResponse;
}

function runGraphQlCommand(
  query: string,
  repository: RepositoryCoordinates,
  pullRequestNumber: number,
  variables: Record<string, string | number | null>,
): CommandResult {
  const args = [
    "api",
    "graphql",
    "-f",
    `query=${query}`,
    "-F",
    `owner=${repository.owner}`,
    "-F",
    `repo=${repository.name}`,
    "-F",
    `number=${String(pullRequestNumber)}`,
  ];

  for (const [name, value] of Object.entries(variables)) {
    if (value === null) {
      continue;
    }

    args.push("-F");
    args.push(`${name}=${String(value)}`);
  }

  return runCommand("gh", args);
}

function runCommand(command: string, args: string[]): CommandResult {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.error !== undefined && result.status === null) {
    throw result.error;
  }

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";

  if (result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${args.join(" ")}`,
        stdout.length > 0 ? `stdout:\n${stdout}` : "",
        stderr.length > 0 ? `stderr:\n${stderr}` : "",
      ]
        .filter((line) => line.length > 0)
        .join("\n\n"),
    );
  }

  return {
    status: result.status,
    stderr,
    stdout,
  };
}

function writeLine(message: string): void {
  process.stdout.write(`${message}\n`);
}

const REVIEW_REQUESTS_QUERY = `
  query(
    $owner: String!
    $repo: String!
    $number: Int!
    $reviewRequestsCursor: String
  ) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        title
        url
        reviewRequests(first: 100, after: $reviewRequestsCursor) {
          nodes {
            requestedReviewer {
              __typename
              ... on Bot {
                login
              }
              ... on Mannequin {
                login
              }
              ... on Team {
                slug
                organization {
                  login
                }
              }
              ... on User {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const PENDING_REVIEWS_QUERY = `
  query(
    $owner: String!
    $repo: String!
    $number: Int!
    $reviewsCursor: String
  ) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        title
        url
        reviewDecision
        reviews(first: 100, after: $reviewsCursor, states: [PENDING]) {
          nodes {
            author {
              login
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const REVIEW_THREADS_QUERY = `
  query(
    $owner: String!
    $repo: String!
    $number: Int!
    $threadsCursor: String
  ) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        reviewThreads(first: 100, after: $threadsCursor) {
          nodes {
            id
            isOutdated
            isResolved
            comments(last: 1) {
              nodes {
                author {
                  login
                }
                body
                line
                path
                url
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
