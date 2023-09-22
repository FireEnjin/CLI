import cp from "recursive-copy";

export default async (config: any) => {
  cp(process.argv[3], process.argv[4], {
    overwrite: true,
  });
};
