import React, { useState, useEffect } from 'react';
import { API_TOKEN } from '../constants';

// helper component for getting an image from Weavy. All files are protected in Weavy and the Bearer token must be supplied 
// to get the file. The way we do it below in this example is not optimized or maybe not even the preferred way to keep a good
// performance. It's an example.
const AuthImage = (props) => {

    const [imgSrc, setImgSrc] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        fetch(props.src, {
            method: "GET",
            cache: "force-cache",
            headers: { Authorization: 'Bearer ' + API_TOKEN }
        })
            .then(response => response.blob())
            .then(image => {
                if (isMounted){ 
                    setImgSrc(URL.createObjectURL(image));
                    setLoading(false);
                }                    
            });
        return () => { isMounted = false };
    }, [props.src])

//if(loading) return <span></span>;

    return (
        <img src={imgSrc} alt="" />
    );
}

export default AuthImage;