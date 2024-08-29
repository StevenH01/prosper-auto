import React from 'react';

const About = () => {
  return (
    <div className='flex flex-col'>
      <div className='sm:mb-2 md:mb-2'>
        <img src="/prosper-logo.png" alt="proser-logo" className='rounded-full sm:mb-2 md:mb-2'/>
      </div>
      <div className='flex text-center justify-center sm:mb-2 md:mb-2'>
        Founded in 2023, our business has been providing top-notch auto styling services to the community for a year. 
        Our team of experts is committed to delivering high quality results, while also providing an outstanding customer service experience. 
        We prioritize our customers and we guarantee customer satisfaction.
      </div>
    </div>
  );
}

export default About;