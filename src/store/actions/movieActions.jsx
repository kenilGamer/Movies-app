export { removemovie } from "../reducers/MovieSlice";
import axios from "../../utils/axios";
import { loadmovie } from "../reducers/MovieSlice";

export const asyncloadmovie = (id) => async (dispatch, getState) => {
    // Create AbortController for request cancellation
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
        const responses = await Promise.all([
            axios.get(`/movie/${id}`, { signal }),
            axios.get(`/movie/${id}/external_ids`, { signal }),
            axios.get(`/movie/${id}/recommendations`, { signal }),
            axios.get(`/movie/${id}/similar`, { signal }),
            axios.get(`/movie/${id}/translations`, { signal }),
            axios.get(`/movie/${id}/videos`, { signal }),
            axios.get(`/movie/${id}/watch/providers`, { signal })
        ]);

        const detail = responses[0].data;
        const externalid = responses[1].data;
        const recommendations = responses[2].data?.results || [];
        const similar = responses[3].data?.results || [];
        const translations = responses[4].data?.translations?.map(t => t.english_name) || [];
        const videos = responses[5].data?.results?.find(m => m.type === "Trailer") || null;
        const watchproviders = responses[6].data?.results?.IN || null;

        let theultimatedetails = {
            detail,
            externalid,
            recommendations,
            similar,
            translations,
            videos,
            watchproviders
        };

        dispatch(loadmovie(theultimatedetails));
    } catch (error) {
        if (error.name === 'CanceledError') {
            console.log("Request canceled");
            return;
        }
        
        // Enhanced error handling
        if (error.response) {
            console.error("Error loading movie:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Network error loading movie:", error.request);
        } else {
            console.error("Error loading movie:", error.message);
        }
        
        // Dispatch error state if needed
        // dispatch(setMovieError(error.message));
    }
    
    // Return cleanup function for component unmount
    return () => {
        abortController.abort();
    };
};