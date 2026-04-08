import { Button } from "@/components/ui/button";

import { getIngredientUnitGroups } from "../utils/ingredientUnits";
import {
  createEmptyRecipeEquipmentFormValue,
  createEmptyRecipeIngredientFormValue,
  createEmptyRecipeStepFormValue,
  type RecipeCreateEquipmentFormValue,
  type RecipeCreateFormValues,
  type RecipeCreateIngredientFormValue,
  type RecipeCreateStepFormValue,
} from "../utils/recipeFormValues";

import type { FormEvent, JSX } from "react";

const inputClassName =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const checkboxClassName =
  "size-4 rounded border border-input text-primary shadow-sm focus:ring-2 focus:ring-primary/20";

type RecipeCreateFormProps = {
  cancelButton: JSX.Element;
  coverPhotoInputResetKey: number;
  hasCoverPhoto: boolean;
  isPending: boolean;
  onCoverPhotoChange: (file: File | null) => void;
  onRemoveCoverPhoto: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  removeCoverPhotoLabel: string;
  setValues: (
    updater: (current: RecipeCreateFormValues) => RecipeCreateFormValues,
  ) => void;
  submitLabel: string;
  submitPendingLabel: string;
  values: RecipeCreateFormValues;
};

export function RecipeCreateForm({
  cancelButton,
  coverPhotoInputResetKey,
  hasCoverPhoto,
  isPending,
  onCoverPhotoChange,
  onRemoveCoverPhoto,
  onSubmit,
  removeCoverPhotoLabel,
  setValues,
  submitLabel,
  submitPendingLabel,
  values,
}: RecipeCreateFormProps): JSX.Element {
  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <section className="space-y-6 border-b border-border pb-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Basics
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-foreground">Title</span>
            <input
              className={inputClassName}
              name="title"
              onChange={(event) => {
                const title = event.target.value;
                setValues((current) => ({ ...current, title }));
              }}
              placeholder="Weeknight tomato pasta"
              value={values.title}
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-medium text-foreground">Summary</span>
            <textarea
              className={`${inputClassName} min-h-18 resize-y`}
              name="summary"
              onChange={(event) => {
                const summary = event.target.value;
                setValues((current) => ({ ...current, summary }));
              }}
              placeholder="Fast, pantry-friendly pasta with bright tomato flavor."
              value={values.summary}
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-medium text-foreground">
              Description
            </span>
            <textarea
              className={`${inputClassName} min-h-40 resize-y`}
              name="description"
              onChange={(event) => {
                const description = event.target.value;
                setValues((current) => ({ ...current, description }));
              }}
              placeholder="Add any context or serving notes."
              value={values.description}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-foreground">
              Yield quantity
            </span>
            <input
              className={inputClassName}
              inputMode="decimal"
              name="yieldQuantity"
              onChange={(event) => {
                const yieldQuantity = event.target.value;
                setValues((current) => ({ ...current, yieldQuantity }));
              }}
              placeholder="4"
              value={values.yieldQuantity}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-foreground">
              Yield unit
            </span>
            <input
              className={inputClassName}
              name="yieldUnit"
              onChange={(event) => {
                const yieldUnit = event.target.value;
                setValues((current) => ({ ...current, yieldUnit }));
              }}
              placeholder="servings"
              value={values.yieldUnit}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-foreground">
              Prep minutes
            </span>
            <input
              className={inputClassName}
              inputMode="numeric"
              name="prepMinutes"
              onChange={(event) => {
                const prepMinutes = event.target.value;
                setValues((current) => ({ ...current, prepMinutes }));
              }}
              placeholder="15"
              value={values.prepMinutes}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-foreground">
              Cook minutes
            </span>
            <input
              className={inputClassName}
              inputMode="numeric"
              name="cookMinutes"
              onChange={(event) => {
                const cookMinutes = event.target.value;
                setValues((current) => ({ ...current, cookMinutes }));
              }}
              placeholder="20"
              value={values.cookMinutes}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 text-sm text-foreground">
          <input
            checked={values.isScalable}
            className={checkboxClassName}
            onChange={(event) => {
              const isScalable = event.target.checked;
              setValues((current) => ({ ...current, isScalable }));
            }}
            type="checkbox"
          />
          Allow ingredient scaling
        </label>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Cover photo
              </h3>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, or WebP up to 5 MB.
              </p>
            </div>
            {hasCoverPhoto ? (
              <Button
                className="rounded-md px-4"
                onClick={onRemoveCoverPhoto}
                size="sm"
                type="button"
                variant="outline"
              >
                {removeCoverPhotoLabel}
              </Button>
            ) : null}
          </div>

          <input
            accept="image/jpeg,image/png,image/webp"
            className={`${inputClassName} file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground`}
            disabled={isPending}
            key={coverPhotoInputResetKey}
            onChange={(event) => {
              onCoverPhotoChange(event.target.files?.[0] ?? null);
            }}
            type="file"
          />
        </div>
      </section>

      <RecipeCreateCollectionSection
        addLabel="Add ingredient"
        items={values.ingredients}
        onAdd={() => {
          setValues((current) => ({
            ...current,
            ingredients: [
              ...current.ingredients,
              createEmptyRecipeIngredientFormValue(),
            ],
          }));
        }}
        onRemove={(index) => {
          setValues((current) => ({
            ...current,
            ingredients: current.ingredients.filter(
              (_, itemIndex) => itemIndex !== index,
            ),
          }));
        }}
        renderItem={(ingredient, index) => (
          <IngredientFields
            ingredient={ingredient}
            onChange={(nextIngredient) => {
              setValues((current) => ({
                ...current,
                ingredients: updateCollectionItem(
                  current.ingredients,
                  index,
                  nextIngredient,
                ),
              }));
            }}
          />
        )}
        title="Ingredients"
      />

      <RecipeCreateCollectionSection
        addLabel="Add equipment"
        items={values.equipment}
        onAdd={() => {
          setValues((current) => ({
            ...current,
            equipment: [
              ...current.equipment,
              createEmptyRecipeEquipmentFormValue(),
            ],
          }));
        }}
        onRemove={(index) => {
          setValues((current) => ({
            ...current,
            equipment: current.equipment.filter(
              (_, itemIndex) => itemIndex !== index,
            ),
          }));
        }}
        renderItem={(equipment, index) => (
          <EquipmentFields
            equipment={equipment}
            onChange={(nextEquipment) => {
              setValues((current) => ({
                ...current,
                equipment: updateCollectionItem(
                  current.equipment,
                  index,
                  nextEquipment,
                ),
              }));
            }}
          />
        )}
        title="Equipment"
      />

      <RecipeCreateCollectionSection
        addLabel="Add step"
        getItemHeading={(index) => `Step ${index + 1}`}
        items={values.steps}
        onAdd={() => {
          setValues((current) => ({
            ...current,
            steps: [...current.steps, createEmptyRecipeStepFormValue()],
          }));
        }}
        onRemove={(index) => {
          setValues((current) => ({
            ...current,
            steps: current.steps.filter((_, itemIndex) => itemIndex !== index),
          }));
        }}
        renderItem={(step, index) => (
          <StepFields
            onChange={(nextStep) => {
              setValues((current) => ({
                ...current,
                steps: updateCollectionItem(current.steps, index, nextStep),
              }));
            }}
            step={step}
          />
        )}
        title="Steps"
      />

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
        {cancelButton}
        <Button
          className="rounded-md px-6"
          disabled={isPending}
          size="lg"
          type="submit"
        >
          {isPending ? submitPendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}

type RecipeCreateCollectionSectionProps<TItem> = {
  addLabel: string;
  getItemHeading?: (index: number) => string | null;
  items: TItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: TItem, index: number) => JSX.Element;
  title: string;
};

function RecipeCreateCollectionSection<TItem>({
  addLabel,
  getItemHeading,
  items,
  onAdd,
  onRemove,
  renderItem,
  title,
}: RecipeCreateCollectionSectionProps<TItem>): JSX.Element {
  return (
    <section className="space-y-4 border-b border-border pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Button
          className="rounded-md px-4"
          onClick={onAdd}
          type="button"
          variant="outline"
        >
          {addLabel}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const itemHeading = getItemHeading?.(index) ?? null;

          return (
            <article
              key={`${title}-${index + 1}`}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div
                className={
                  itemHeading === null
                    ? "flex justify-end gap-3"
                    : "flex items-center justify-between gap-3"
                }
              >
                {itemHeading !== null ? (
                  <p className="text-sm font-semibold text-foreground">
                    {itemHeading}
                  </p>
                ) : null}
                <Button
                  onClick={() => {
                    onRemove(index);
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Remove
                </Button>
              </div>
              <div className="mt-4">{renderItem(item, index)}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type IngredientFieldsProps = {
  ingredient: RecipeCreateIngredientFormValue;
  onChange: (ingredient: RecipeCreateIngredientFormValue) => void;
};

function IngredientFields({
  ingredient,
  onChange,
}: IngredientFieldsProps): JSX.Element {
  const normalizedUnit = ingredient.unit.trim();
  const unitGroups = getIngredientUnitGroups(normalizedUnit);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="md:col-span-2">
        <span className="text-sm font-medium text-foreground">Ingredient</span>
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...ingredient, item: event.target.value });
          }}
          placeholder="Olive oil"
          value={ingredient.item}
        />
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">Amount</span>
        <input
          className={inputClassName}
          inputMode="decimal"
          onChange={(event) => {
            onChange({ ...ingredient, amount: event.target.value });
          }}
          placeholder="2"
          value={ingredient.amount}
        />
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">Unit</span>
        <select
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...ingredient, unit: event.target.value.trim() });
          }}
          value={normalizedUnit}
        >
          <option value="">No unit</option>
          {unitGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">Preparation</span>
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...ingredient, preparation: event.target.value });
          }}
          placeholder="minced"
          value={ingredient.preparation}
        />
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">Notes</span>
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...ingredient, notes: event.target.value });
          }}
          placeholder="plus more for serving"
          value={ingredient.notes}
        />
      </label>

      <label className="md:col-span-2 flex items-center gap-3 text-sm text-foreground">
        <input
          checked={ingredient.isOptional}
          className={checkboxClassName}
          onChange={(event) => {
            onChange({ ...ingredient, isOptional: event.target.checked });
          }}
          type="checkbox"
        />
        Optional
      </label>
    </div>
  );
}

type EquipmentFieldsProps = {
  equipment: RecipeCreateEquipmentFormValue;
  onChange: (equipment: RecipeCreateEquipmentFormValue) => void;
};

function EquipmentFields({
  equipment,
  onChange,
}: EquipmentFieldsProps): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label>
        <span className="text-sm font-medium text-foreground">Equipment</span>
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...equipment, name: event.target.value });
          }}
          placeholder="Chef's knife"
          value={equipment.name}
        />
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">Details</span>
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...equipment, details: event.target.value });
          }}
          placeholder="10-inch skillet"
          value={equipment.details}
        />
      </label>

      <label className="md:col-span-2 flex items-center gap-3 text-sm text-foreground">
        <input
          checked={equipment.isOptional}
          className={checkboxClassName}
          onChange={(event) => {
            onChange({ ...equipment, isOptional: event.target.checked });
          }}
          type="checkbox"
        />
        Optional
      </label>
    </div>
  );
}

type StepFieldsProps = {
  onChange: (step: RecipeCreateStepFormValue) => void;
  step: RecipeCreateStepFormValue;
};

function StepFields({ onChange, step }: StepFieldsProps): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="md:col-span-2">
        <span className="text-sm font-medium text-foreground">Instruction</span>
        <textarea
          className={`${inputClassName} min-h-28 resize-y`}
          onChange={(event) => {
            onChange({ ...step, instruction: event.target.value });
          }}
          placeholder="Bring a large pot of salted water to a boil."
          value={step.instruction}
        />
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">Notes</span>
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...step, notes: event.target.value });
          }}
          placeholder="Lower the heat if the sauce reduces too quickly."
          value={step.notes}
        />
      </label>

      <label>
        <span className="text-sm font-medium text-foreground">
          Timer duration (seconds)
        </span>
        <input
          className={inputClassName}
          inputMode="numeric"
          onChange={(event) => {
            onChange({ ...step, timerSeconds: event.target.value });
          }}
          placeholder="300"
          value={step.timerSeconds}
        />
      </label>
    </div>
  );
}

function updateCollectionItem<TItem>(
  items: TItem[],
  index: number,
  nextItem: TItem,
): TItem[] {
  return items.map((item, itemIndex) =>
    itemIndex === index ? nextItem : item,
  );
}
