import React from 'react';
import { Helmet } from 'react-helmet-async';
interface IProps {
    title: string
}


export const HelmetContainer: React.FC<IProps> = ({ title }) => (
    <Helmet>
        <title>{title} | Kings Eats</title>
    </Helmet>
);

