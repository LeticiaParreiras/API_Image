import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const GetImage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const Delete = async () => {
        if (window.confirm("Tem certeza?")) {
            try {
                await axios.delete(`http://localhost:3000/Image/${id}`);
                alert("Imagem deletada com sucesso");
                navigate('/');
            } catch (error) {
                alert("Erro ao deletar imagem");
            }
        }
    };

    return (
        <>
        <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Voltar</a>
            <div className='img'>
                <img src={`http://localhost:3000/Image/${id}`} alt="" />
            </div>
            <div>
                <button onClick={Delete}>Delete</button>
            </div>
        </>
    );
};