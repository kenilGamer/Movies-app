export { removeperson } from "../reducers/personSlice";
import axios from "../../utils/axios";
import { loadperson } from "../reducers/personSlice";

export const asyncloadperson = (id) => async (dispatch, getState) => {
    try {
        const responses = await Promise.all([
            axios.get(`/person/${id}`),
            axios.get(`/person/${id}/external_ids`),
            axios.get(`/person/${id}/combined_credits`),
            axios.get(`/person/${id}/tv_credits`),
            axios.get(`/person/${id}/movie_credits`)
        ]);

        let theultimatedetails = {
            detail: responses[0].data,
            externalid: responses[1].data,
            combinedCredits: responses[2].data,
            movieCredits: responses[3].data,
            tvCredits: responses[4].data,
        };

        dispatch(loadperson(theultimatedetails));
    } catch (error) {
        console.log("Error: ", error);
    }
};