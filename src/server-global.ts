import path from 'path';
import winston from 'winston';

import { Sequelize } from 'sequelize';

import { Topic, Category } from './model/shared/enumerations';

class ServerGlobal {
    private readonly _logger: winston.Logger;
    private readonly _db: Sequelize;
    private readonly _movieCategories: ReadonlyArray<{ value: Category, label: string }>;
    private readonly _contactTopics: ReadonlyArray<{ value: Topic, label: string }>;

    private static _instance: ServerGlobal;

    private constructor() {
        this._logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(__dirname, '../logs.log'),
                    level: 'info',
                }),
            ],
        });

        this._db = new Sequelize(
            process.env.MYSQL_SCHEMA,
            process.env.MYSQL_USERNAME,
            process.env.MYSQL_PASSWORD,
            {
                dialect: 'mysql',
                host: process.env.MYSQL_HOST,
            },
        ); 

        this._movieCategories = [
            { value: Category.Other, label: 'Other' },
            { value: Category.Action, label: 'Action' },
            { value: Category.Comedy, label: 'Comedy' },
            { value: Category.Drama, label: 'Drama' },
            { value: Category.Fantasy, label: 'Fantasy' },
            { value: Category.Horror, label: 'Horror' },
            { value: Category.Mystery, label: 'Mystery' },
            { value: Category.Romance, label: 'Romance' },
            { value: Category.Thriller, label: 'Thriller' },
            { value: Category.Western, label: 'Western' },
        ];

        this._contactTopics = [
            { value: Topic.Other, label: 'Other' },
            { value: Topic.Delivery, label: 'Delivery' },
            { value: Topic.OrderIssues, label: 'Order Issues' },
            { value: Topic.ReturnsAndRefunds, label: 'Returns and Refunds' },
            { value: Topic.Technical, label: 'Technical' },
        ];
    }

    /**
    * Getter for singelton instance
    * @returns ServerGlobal singelton instance
    */
    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new ServerGlobal();
        return this._instance;
    }

    /**
    * Getter for _movieCategories property
    * @returns _moviesCategories property
    */
    public get movieCategories() {
        return [...this._movieCategories];
    }

    /**
    * Getter for the values of the movie movies
    * @returns product movies values array
    */
    public get movieCategoriesValues() {
        return this._movieCategories.map((Category) => Category.value);
    }

    /**
    * Getter for label of provided category value
    * @param value value of category
    * @returns label string
    */
    public getCategoryLabel(value: Category) {
        const matcingCategory = this._movieCategories.find((Category) => Category.value === value);

        if (!matcingCategory) {
            return null;
        }

        return matcingCategory.label;
    }

    /**
    * Validator for category value
    * @param value category value
    * @returns boolean flag indicates whether the category is valid
    */
    public isValidCategoryValue(value: Category) {
        return !!this._movieCategories.find((Category) => Category.value === value);
    }

    /**
    * Getter for label of provided contact topic value
    * @param value value of contact topic
    * @returns label string
    */
    public getContactTopicLabel(value: Topic) {
        const matchingTopic = this._contactTopics.find((contactTopic) => contactTopic.value === value);

        if (!matchingTopic) {
            return null;
        }

        return matchingTopic.label;
    }

    /**
    * Getter for _contactTopics property
    * @returns _contactTopics property
    */
    public get contactTopics() {
        return [...this._contactTopics];
    }

    /**
    * Getter for the logger
    * @returns logger instance 
    */
    public get logger() {
        return this._logger;
    }

    /**
     * Getter for the db
     * @returns db instance
     */
    public get db() {
        return this._db;
    }
}

export default ServerGlobal;