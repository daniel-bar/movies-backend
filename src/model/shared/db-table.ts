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
}

interface IDBUserAttributes extends IDBAttribute {
    email: string;
    readonly username: string;
    password: string;
}

interface IDBFavoriteMoviesAttributes extends IDBAttribute {
    movie_id: number;
    userId: number;
}

interface IDBTokenAttributes extends IDBAttribute {
    token: string;
    userId: number;
}

export {
    IDBAttribute,
    IDBMoviesAttributes,
    IDBUserAttributes,
    IDBFavoriteMoviesAttributes,
    IDBTokenAttributes,
}