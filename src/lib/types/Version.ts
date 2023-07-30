import IVersion from "../interfaces/IVersion";
import {ObjectId} from "mongodb";
import {id} from 'mongodb-typescript'

export default class Version implements IVersion {

    static compare(version1: IVersion, version2: IVersion){

        return (
            version1.major == version2.major &&
            version1.minor == version2.minor &&
            version1.build == version2.build &&
            version1.bugfix == version2.bugfix
        );

    }

    @id
    id: ObjectId;

    bugfix: string;
    build: string;
    major: string;
    minor: string;

}