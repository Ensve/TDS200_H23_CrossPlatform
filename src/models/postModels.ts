// Define an interface for individual posts
export interface IPosts {
    id: number;
    title: string;
    description: string;
    hashtags: string[];
    image: string[];
    comments: string[];
}

// Define an interface for the response containing a single post
export interface IPostResponse {
    posts_by_id: IPosts;
}

// Define an interface for the response containing multiple posts
export interface IPostResponse {
    posts_upload: IPosts[];
}

// Define an interface for creating a new post
export interface INewPost {
    id: number;
    title: string;
    description: string;
    hashtags: string[];
    image: string[];
}