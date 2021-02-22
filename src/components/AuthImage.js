import React, { useState, useEffect } from 'react';
import { API_TOKEN } from '../constants';

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