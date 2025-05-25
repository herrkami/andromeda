
export default async function (eleventyConfig) {

    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
  
    // eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");
  
    // eleventyConfig.addWatchTarget("src/js/*");
    eleventyConfig.addWatchTarget("src/css/*");
};