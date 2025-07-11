export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: new Date().toISOString().split("T")[0],
    description: "Description",
  },
  {
    slug: "sample-post",
    title: "Sample Post",
    date: new Date().toISOString().split("T")[0],
    description: "Another test post for the blog",
  },
];
