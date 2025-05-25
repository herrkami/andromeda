
export default async function (eleventyConfig) {
	// const { I18nPlugin, RenderPlugin, HtmlBasePlugin } = await import("@11ty/eleventy");
    // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
  
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");
  
    eleventyConfig.addWatchTarget("src/js/*");
    eleventyConfig.addWatchTarget("src/css/*");
};