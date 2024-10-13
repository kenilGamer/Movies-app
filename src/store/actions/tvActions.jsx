export { removetv } from "../reducers/tvSlice";
import axios from "../../utils/axios";
import { loadtv } from "../reducers/tvSlice";

export const asyncloadtv = (id) => async (dispatch, getState) => {
    try {
        const responses = await Promise.all([
            axios.get(`/tv/${id}`),
            axios.get(`/tv/${id}/external_ids`),
            axios.get(`/tv/${id}/recommendations`),
            axios.get(`/tv/${id}/similar`),
            axios.get(`/tv/${id}/translations`),
            axios.get(`/tv/${id}/videos`),
            axios.get(`/tv/${id}/watch/providers`)
        ]);

        const [
            detail,
            externalid,
            recommendations,
            similar,
            translations,
            videos,
            watchproviders
        ] = responses;

        let theultimatedetails = {
            detail: detail.data,
            externalid: externalid.data,
            recommendations: recommendations.data.results,
            similar: similar.data.results,
            translations: translations.data.translations.map(
                (t) => t.english_name
            ),
            videos: videos.data.results.find((m) => m.type === "Trailer"),
            watchproviders: watchproviders.data.results.IN,
        };
        console.log(theultimatedetails);
        dispatch(loadtv(theultimatedetails));
    } catch (error) {
        console.log("Error: ", error);
    }
};