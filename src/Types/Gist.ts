export interface Gist 
    {
        id: string;
        node_id: string;
        html_url: string;
        files: {
            [key: string]: {
                filename: string;
                type: string;
                language: string;
                raw_url: string;
                size: number;
                content? : string;
            }
        };
        forks: Fork[];
        public: boolean;
        created_at: string;
        updated_at: string;
        description: string;
        comments: number;
        user: string;
        comments_url: string;
        owner: {
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string | null;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
            site_admin: boolean;
        };
        truncated: boolean;
    }

    export interface Fork {
        created_at: string;
        id : string;
        updated_at: string;
        url : string;
        user : {
            login : string;
        }
    }