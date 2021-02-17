import React, { useState, useEffect } from 'react';
import { API_TOKEN } from '../constants';

const AuthImage = (props) => {

    const [imgSrc, setImgSrc] = useState('');

    useEffect(() => {
        let isMounted = true;
        fetch(props.src, {
            method: "GET",
            headers: { Authorization: 'Bearer ' + API_TOKEN }
        })
            .then(response => response.blob())
            .then(image => {
                if (isMounted){
                    setImgSrc(URL.createObjectURL(image));
                }                    
            });
        return () => { isMounted = false };
    }, [props.src])

    return (
        <img src={imgSrc} alt="" />
    );
}

export default AuthImage;