import React, { useEffect, useState, useCallback, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../partials/Card';
import Dropdown from '../partials/Dropdown';
import Topnev from '../partials/topnev';
import AdvancedFilters from './AdvancedFilters';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { FaLongArrowAltLeft } from 'react-icons/fa';

function Tv() {
    document.title = "Godcrfts | tvs";

    const navigate = useNavigate();
    const [category, setcategory] = useState("airing_today");
    const [tv, settv] = useState([]);
    const [page, setpage] = useState(1);
    const [hasMore, sethasMore] = useState(true);
    const [filters, setFilters] = useState({});
    const [useFilters, setUseFilters] = useState(false);
    const abortControllerRef = useRef(null);

    const Gettv = useCallback(async (currentPage = page, currentCategory = category, currentFilters = filters) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        try {
            let data;
            if (useFilters && Object.keys(currentFilters).length > 0) {
                // Use discover endpoint with filters
                const params = {
                    page: currentPage,
                    sort_by: currentFilters.sortBy || 'popularity.desc',
                };
                if (currentFilters.genres && currentFilters.genres.length > 0) {
                    params.with_genres = currentFilters.genres.join(',');
                }
                if (currentFilters.yearMin) {
                    params['first_air_date.gte'] = `${currentFilters.yearMin}-01-01`;
                }
                if (currentFilters.yearMax) {
                    params['first_air_date.lte'] = `${currentFilters.yearMax}-12-31`;
                }
                if (currentFilters.ratingMin !== undefined) {
                    params['vote_average.gte'] = currentFilters.ratingMin;
                }
                if (currentFilters.ratingMax !== undefined) {
                    params['vote_average.lte'] = currentFilters.ratingMax;
                }
                if (currentFilters.language) {
                    params.with_original_language = currentFilters.language;
                }
                const response = await axios.get('/discover/tv', {
                    params,
                    signal: abortControllerRef.current.signal
                });
                data = response.data;
            } else {
                const response = await axios.get(`/tv/${currentCategory}?page=${currentPage}`, {
                    signal: abortControllerRef.current.signal
                });
                data = response.data;
            }
            
            if (data.results && data.results.length > 0) {
                if (currentPage === 1) {
                    settv(data.results);
                } else {
                    settv((prevState) => [...prevState, ...data.results]);
                }
                setpage(currentPage + 1);
                sethasMore(data.page < data.total_pages);
            } else {
                sethasMore(false);
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.log("Error: ", error);
                sethasMore(false);
            }
        }
    }, [category, page, filters, useFilters]);

    const refershHandler = useCallback(() => {
        setpage(1);
        settv([]);
        sethasMore(true);
        Gettv(1, category, filters);
    }, [category, filters, Gettv]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        const hasActiveFilters = Object.values(newFilters).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(v => v !== '' && v !== 0 && v !== 1900);
            }
            return value !== '' && value !== 'popularity.desc';
        });
        setUseFilters(hasActiveFilters);
    }, []);

    useEffect(() => {
        refershHandler();
    }, [category]);

    useEffect(() => {
        if (useFilters) {
            refershHandler();
        }
    }, [filters, useFilters]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return tv.length > 0 ? (
        <div className="w-full h-screen ">
            <div className=" px-[5%] w-full flex items-center justify-between ">
                <h1 className=" text-2xl font-semibold text-zinc-400">
                    <i
                        onClick={() => navigate(-1)}
                        className="hover:text-[#6556CD] ri-arrow-left-line"
                    ></i>{" "}
                    tv
                    <small className="ml-2 text-sm text-zinc-600">
                        ({category})
                    </small>
                </h1>
                <div className="flex max-md:flex-col items-center w-[80%]">
                    <Topnev />
                    {!useFilters && (
                        <Dropdown
                            title="Category"
                            options={[
                                "on_the_air",
                                "popular",
                                "top_rated",
                                "airing_today",
                            ]}
                            func={(e) => setcategory(e.target.value)}
                        />
                    )}
                    <div className="w-[2%]"></div>
                </div>
            </div>

            <div className="px-[5%] mb-6">
                <AdvancedFilters mediaType="tv" onFilterChange={handleFilterChange} />
            </div>

            <InfiniteScroll
                dataLength={tv.length}
                next={() => Gettv()}
                hasMore={hasMore}
                loader={<h1>Loading...</h1>}
            >
                <Card data={tv} title="tv" />
            </InfiniteScroll>
        </div>
    ) : (
        <Loading />
    );
}

export default Tv