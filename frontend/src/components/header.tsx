import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/cooking.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
export const Header = () => {
    return (
        <>
            <header>
                <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
                    <Link to="/">
                        <img src={logo} className="w-11" alt="Kings Eats" />
                    </Link>
                    <span className="text-xs">
                        <Link to="/edit-profile">
                            <FontAwesomeIcon icon={faUser} className="text-3xl" />
                        </Link>
                    </span>
                </div>
            </header>
        </>
    )
};
