
export default async function (eleventyConfig) {

    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("public");
  
    // eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/md");
  
    // eleventyConfig.addWatchTarget("src/js/*");
    eleventyConfig.addWatchTarget("src/css/*");
};
