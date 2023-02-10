import '../App.css';
import { BsArrowRight } from 'react-icons/bs';
import React from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';

const animationClass = 'transition duration-500 ease-in-out hover:scale-110 hover:translate-y-1'

function Landing() {
    return (
        <div className="Landing">
            <div className='flex flex-col items-center lg:items-start md:flex-row md:px-60 py-12 justify-between w-full'>
                {Header()}
                {Menu()}
            </div>
            <div className='flex flex-row w-full justify-center mt-12 animate__animated animate__fadeInDown'>
                {landingContent()}
            </div>
            <h1 className='text-white font-bold text-3xl text-center animate__animated animate__fadeInDown'>Features</h1>
            {features()}
        </div>
    );
}

export default Landing;

function features() {
    return <div className='flex flex-row w-full items-center justify-center mb-12 flex-wrap animate__animated animate__fadeInDown'>
        <div className='flex flex-row md:px-60 w-full py-12 md:w-10/12 justify-center md:justify-between items-center flex-wrap gap-y-5 gap-x-5'>
            <div className={`featureBox w-60 h-auto px-5 py-12 cursor-pointer'} ${animationClass}`} data-micron="bounce">
                <h1 className='text-white/75 font-bold text-lg text-center uppercase'>Text <br /> Generation</h1>
                <p className='text-white/70 text-center mt-4 font-display'>Generate text for your blog, social media, website, and more!</p>
            </div>
            <div className={`featureBox w-60 h-auto px-5 py-12 cursor-pointer'} ${animationClass}`} data-micron="bounce">
                <h1 className='text-white/75 font-bold text-lg text-center uppercase'>Long Text <br /> Generation</h1>
                <p className='text-white/70 text-center mt-4 font-display'>Our AI Tool efficiently generates the long text using modern GPT-3</p>
            </div>
            <div className={`featureBox w-60 h-auto px-5 py-12 cursor-pointer'} ${animationClass}`} data-micron="bounce">
                <h1 className='text-white/75 font-bold text-lg text-center uppercase'>Image <br /> Generation</h1>
                <p className='text-white/70 text-center mt-4 font-display'>Our AI Tool efficiently generates images using modern D.A.L.L.E</p>
            </div>
            <div className={`featureBox w-60 h-auto px-5 py-12 cursor-pointer'} ${animationClass}`} data-micron="bounce">
                <h1 className='text-white/75 font-bold text-lg text-center uppercase '>Answers the <br /> Question</h1>
                <p className='text-white/70 text-center mt-4 font-display'>Our AI Tool efficiently answers the question just like ChatGPT</p>
            </div>
        </div>
    </div>;
}

function landingContent() {
    return <div className='flex flex-col justify-center px-10 py-5 md:px-24 md:py-12 
    w-11/12 lg:w-6/12 gap-y-8 items-center'>
        <h1 className='text-white/70 text-center'>MEET GPTIFY 👋</h1>
        <h1 className='text-white text-2xl md:text-5xl font-bold text-center w-full'>Unleash Your <br /> Imagination with <br /> Automated Creativity</h1>
        <h1 className='text-white/70 text-center font-display md:w-3/4'>Artificial intelligence makes it fast & easy to create content for your blog, social media, website, and more! Rated 5/5 stars in 3,000+ reviews.</h1>
        <button className={`inline-flex w-full md:w-1/2 items-center justify-center btnPrimary ${animationClass} py-6 gap-x-2 text-white/80 mb-12`}>Get Started <BsArrowRight /></button>
    </div>;
}

function Menu() {
    return <div className='flex flex-row items-center space-x-10 mt-12 md:mt-0'>
        <Link to={'/text'} className='text-white font-display text-lg cursor-pointer hover:text-white/80'>Text</Link>
        <Link to={'/image'} className='text-white font-display text-lg cursor-pointer hover:text-white/80'>Image</Link>
        <Link to={'/answer'} className='text-white font-display text-lg cursor-pointer hover:text-white/80'>Answer</Link>
    </div>;
}

function Header() {
    return <div className='flex flex-row items-center space-x-3'>
        <Link to={'/'} className='text-white font-bold text-3xl'>GPTIFY</Link>
        <h1 className='text-black text-sm bg-white px-2 rounded-full'>BETA</h1>
    </div>;
}

