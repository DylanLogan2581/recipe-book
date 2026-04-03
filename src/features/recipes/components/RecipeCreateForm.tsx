import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

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
  "mt-2 w-full rounded-2xl border border-input bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const checkboxClassName =
  "size-4 rounded border border-input text-primary shadow-sm focus:ring-2 focus:ring-primary/20";

type RecipeCreateFormProps = {
  coverPhotoName: string | null;
  coverPhotoInputResetKey: number;
  isPhotoAttached: boolean;
  isPending: boolean;
  onCoverPhotoChange: (file: File | null) => void;
  onRemoveCoverPhoto: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setValues: (
    updater: (current: RecipeCreateFormValues) => RecipeCreateFormValues,
  ) => void;
  values: RecipeCreateFormValues;
};

export function RecipeCreateForm({
  coverPhotoName,
  coverPhotoInputResetKey,
  isPhotoAttached,
  isPending,
  onCoverPhotoChange,
  onRemoveCoverPhoto,
  onSubmit,
  setValues,
  values,
}: RecipeCreateFormProps): JSX.Element {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <section className="rounded-[2rem] border border-border/80 bg-card/95 px-6 py-6 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Basics
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] text-foreground">
            Start with the shape of the recipe.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Capture the title, quick summary, yield, timing, and whether serving
            scaling should stay available later.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
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
              className={`${inputClassName} min-h-24 resize-y`}
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
            <span className="text-sm font-medium text-foreground">Description</span>
            <textarea
              className={`${inputClassName} min-h-32 resize-y`}
              name="description"
              onChange={(event) => {
                const description = event.target.value;
                setValues((current) => ({ ...current, description }));
              }}
              placeholder="Add any context, serving notes, or why this dish earns a spot in the rotation."
              value={values.description}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-foreground">Yield quantity</span>
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
            <span className="text-sm font-medium text-foreground">Yield unit</span>
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
            <span className="text-sm font-medium text-foreground">Prep minutes</span>
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
            <span className="text-sm font-medium text-foreground">Cook minutes</span>
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

        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground">
          <input
            checked={values.isScalable}
            className={checkboxClassName}
            onChange={(event) => {
              const isScalable = event.target.checked;
              setValues((current) => ({ ...current, isScalable }));
            }}
            type="checkbox"
          />
          Allow serving scaling for this recipe.
        </label>

        <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-background/75 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-foreground">Cover photo</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Upload a JPG, PNG, or WebP image up to 5 MB. The file is stored
                in Supabase Storage and the recipe saves only the storage path.
              </p>
            </div>
            {isPhotoAttached ? (
              <Button
                className="rounded-full px-4"
                onClick={onRemoveCoverPhoto}
                size="sm"
                type="button"
                variant="outline"
              >
                Remove photo
              </Button>
            ) : null}
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-foreground">
              Select image
            </span>
            <input
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClassName} file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary`}
              disabled={isPending}
              key={coverPhotoInputResetKey}
              onChange={(event) => {
                onCoverPhotoChange(event.target.files?.[0] ?? null);
              }}
              type="file"
            />
          </label>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {coverPhotoName === null
              ? "No cover photo selected yet."
              : `Selected file: ${coverPhotoName}`}
          </p>
        </div>
      </section>

      <RecipeCreateCollectionSection
        addLabel="Add ingredient"
        description="Keep ingredients in cooking order so prep and shopping stay predictable."
        items={values.ingredients}
        itemLabel="Ingredient"
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
            ingredients: current.ingredients.filter((_, itemIndex) => itemIndex !== index),
          }));
        }}
        renderItem={(ingredient, index) => (
          <IngredientFields
            ingredient={ingredient}
            index={index}
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
        description="Equipment is optional, but it helps future cooks see the setup at a glance."
        items={values.equipment}
        itemLabel="Equipment"
        onAdd={() => {
          setValues((current) => ({
            ...current,
            equipment: [...current.equipment, createEmptyRecipeEquipmentFormValue()],
          }));
        }}
        onRemove={(index) => {
          setValues((current) => ({
            ...current,
            equipment: current.equipment.filter((_, itemIndex) => itemIndex !== index),
          }));
        }}
        renderItem={(equipment, index) => (
          <EquipmentFields
            equipment={equipment}
            index={index}
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
        description="Steps stay ordered so the detail page can render a clean cooking flow immediately after creation."
        items={values.steps}
        itemLabel="Step"
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
            index={index}
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

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button asChild size="lg" variant="outline" className="rounded-full px-5">
          <Link to="/recipes">Cancel</Link>
        </Button>
        <Button
          className="rounded-full px-6"
          disabled={isPending}
          size="lg"
          type="submit"
        >
          {isPending ? "Saving recipe..." : "Create recipe"}
        </Button>
      </div>
    </form>
  );
}

type RecipeCreateCollectionSectionProps<TItem> = {
  addLabel: string;
  description: string;
  items: TItem[];
  itemLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: TItem, index: number) => JSX.Element;
  title: string;
};

function RecipeCreateCollectionSection<TItem>({
  addLabel,
  description,
  items,
  itemLabel,
  onAdd,
  onRemove,
  renderItem,
  title,
}: RecipeCreateCollectionSectionProps<TItem>): JSX.Element {
  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/85 px-6 py-6 shadow-[0_20px_60px_-44px_rgba(69,52,35,0.5)] sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {title}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <Button
          className="rounded-full px-5"
          onClick={onAdd}
          type="button"
          variant="outline"
        >
          {addLabel}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <article
            key={`${title}-${index + 1}`}
            className="rounded-[1.5rem] border border-border/70 bg-card/90 p-4 shadow-[0_16px_40px_-34px_rgba(69,52,35,0.45)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                {itemLabel} {index + 1}
              </p>
              <Button
                disabled={items.length === 1 && (title === "Ingredients" || title === "Steps")}
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
        ))}
      </div>
    </section>
  );
}

type IngredientFieldsProps = {
  index: number;
  ingredient: RecipeCreateIngredientFormValue;
  onChange: (ingredient: RecipeCreateIngredientFormValue) => void;
};

function IngredientFields({
  index,
  ingredient,
  onChange,
}: IngredientFieldsProps): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="md:col-span-2">
        <span className="text-sm font-medium text-foreground">Ingredient name</span>
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
        <input
          className={inputClassName}
          onChange={(event) => {
            onChange({ ...ingredient, unit: event.target.value });
          }}
          placeholder="tbsp"
          value={ingredient.unit}
        />
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

      <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground">
        <input
          checked={ingredient.isOptional}
          className={checkboxClassName}
          onChange={(event) => {
            onChange({ ...ingredient, isOptional: event.target.checked });
          }}
          type="checkbox"
        />
        Mark ingredient {index + 1} as optional.
      </label>
    </div>
  );
}

type EquipmentFieldsProps = {
  equipment: RecipeCreateEquipmentFormValue;
  index: number;
  onChange: (equipment: RecipeCreateEquipmentFormValue) => void;
};

function EquipmentFields({
  equipment,
  index,
  onChange,
}: EquipmentFieldsProps): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label>
        <span className="text-sm font-medium text-foreground">Equipment name</span>
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

      <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground">
        <input
          checked={equipment.isOptional}
          className={checkboxClassName}
          onChange={(event) => {
            onChange({ ...equipment, isOptional: event.target.checked });
          }}
          type="checkbox"
        />
        Mark equipment {index + 1} as optional.
      </label>
    </div>
  );
}

type StepFieldsProps = {
  index: number;
  onChange: (step: RecipeCreateStepFormValue) => void;
  step: RecipeCreateStepFormValue;
};

function StepFields({ index, onChange, step }: StepFieldsProps): JSX.Element {
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
        <span className="text-sm font-medium text-foreground">Timer seconds</span>
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

      <p className="md:col-span-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Step {index + 1} stays in recipe order.
      </p>
    </div>
  );
}

function updateCollectionItem<TItem>(
  items: TItem[],
  index: number,
  nextItem: TItem,
): TItem[] {
  return items.map((item, itemIndex) => (itemIndex === index ? nextItem : item));
}
