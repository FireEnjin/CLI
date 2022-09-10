declare type CustomHelpers = {
    [helperName: string]: any;
};
/**
 * Render a lump of handlebars
 */
export default function renderHandlebars(templateStr: string, data?: any, options?: {
    partials?: {
        id: string;
        html?: string;
    }[];
    helpers?: CustomHelpers;
}): string;
export {};
