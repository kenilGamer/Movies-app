export { removemovie } from "../reducers/MovieSlice";
import axios from "../../utils/axios";
import { loadmovie } from "../reducers/MovieSlice";

export const asyncloadmovie = (id) => async (dispatch, getState) => {
    try {
        const responses = await Promise.all([
            axios.get(`/movie/${id}`),
            axios.get(`/movie/${id}/external_ids`),
            axios.get(`/movie/${id}/recommendations`),
            axios.get(`/movie/${id}/similar`),
            axios.get(`/movie/${id}/translations`),
            axios.get(`/movie/${id}/videos`),
            axios.get(`/movie/${id}/watch/providers`)
        ]);

        const detail = responses[0].data;
        const externalid = responses[1].data;
        const recommendations = responses[2].data.results;
        const similar = responses[3].data.results;
        const translations = responses[4].data.translations.map(t => t.english_name);
        const videos = responses[5].data.results.find(m => m.type === "Trailer");
        const watchproviders = responses[6].data.results.IN;

        let theultimatedetails = {
            detail,
            externalid,
            recommendations,
            similar,
            translations,
            videos,
            watchproviders
        };

        // console.log(theultimatedetails);
        dispatch(loadmovie(theultimatedetails));
    } catch (error) {
        console.log("Error: ", error);
    }
};