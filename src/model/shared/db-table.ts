import { MovieCategory } from '../../server-global';


interface IDBAttribute {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

interface IDBMoviesAttributes extends IDBAttribute {
    readonly title: string;
    readonly description: string;
    readonly category: MovieCategory;
    readonly release_date: number;
    readonly movie_hour_length: number;
    readonly movie_minute_length: number;
    readonly image_path: string;
    readonly video_path: string;
    like_count: number;
    readonly user_id: number;

}

interface IDBUserAttributes extends IDBAttribute {
    email: string;
    readonly username: string;
    password: string;
    like_count: number;
}

interface IDBFavoriteMoviesAttributes extends IDBAttribute {
    readonly movie_id: number;
    readonly user_id: number;
}

interface IDBTokenAttributes extends IDBAttribute {
    readonly token: string;
    readonly user_id: number;
}

export {
    IDBAttribute,
    IDBMoviesAttributes,
    IDBUserAttributes,
    IDBFavoriteMoviesAttributes,
    IDBTokenAttributes,
}