import { AxiosResponse } from "axios";
import axios from "../axios";
import { User } from "../../models/User";

export async function getSortedUserList(role: string = "") : Promise<User[]> {
    const response: AxiosResponse<User[]> = await axios.get(
        role === "student"? "/allStudentNamesAndIds": "/allNamesAndIds"
    );
    return response.data.sort((a, b) =>
    (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName))
}
