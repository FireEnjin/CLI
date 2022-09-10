export default function renderHandlebarsTemplateToFile(templateFile: string, outFile: string, { data, formatWithPrettier, partials, helpers, templatesDir, }?: {
    formatWithPrettier?: boolean;
    data?: any;
    partials?: {
        id: string;
        html?: string;
    }[];
    helpers?: {
        [helperName: string]: any;
    };
    templatesDir?: string;
}): Promise<unknown>;
