import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const ListImages: React.FC = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:3000/Image');
            console.log(response.data);
            setImages(response.data);
        } catch (err) {
            setError('Failed to load images');
        }
        };
    
        fetchImages();
    }, []);
    
        if (error) {
            return <div>{error}</div>
        }
    
        return (
            
            <div className='imgs-container'>
                {images.map((img) => (
                    <div className='imgs'>
                    <img key={`${img.id}`} src={`${img.url}`} alt="" srcSet="" onClick={() => navigate(`/image/${img.id}`)} />
                    </div>
                    
                ))}
            </div>
        );
    };