import * as Handlebars from "handlebars";
import getHandlebarsHelpers from "./getHandlebarsHelpers";
let currentHelpers: string[] = [];

declare type CustomHelpers = { [helperName: string]: any };

/**
 * Render a lump of handlebars
 */
export default function renderHandlebars(
  templateStr: string,
  data?: any,
  options?: {
    partials?: { id: string; html?: string }[];
    helpers?: CustomHelpers;
  }
): string {
  for (const partial of options?.partials || []) {
    Handlebars.registerPartial(partial.id, partial?.html || "");
  }
  try {
    const helpers = (
      Object.keys(options?.helpers || []).length
        ? options?.helpers
        : getHandlebarsHelpers()
    ) as CustomHelpers;
    for (const [helperName, helperFn] of Object.entries(helpers)) {
      try {
        if (currentHelpers.includes(helperName))
          Handlebars.unregisterHelper(helperName);
        Handlebars.registerHelper(helperName, helperFn as any);
        if (!currentHelpers.includes(helperName))
          currentHelpers = [...currentHelpers, helperName];
      } catch (error) {
        console.log(`Error setting helper ${helperName}.`, error);
      }
    }
  } catch {
    console.log("Error setting helpers.");
  }

  return Handlebars.compile(templateStr)(data);
}
