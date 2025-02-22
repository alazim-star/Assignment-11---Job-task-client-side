import React from 'react';
import moment from 'moment';

const Progress = () => {
    return ( 

        <div>
          <h2 className='text-purple-900  text-5xl font-bold mt-10 text-center'>Our client</h2>
                <div className='mt-10 bg-gradient-to-r from-[#23085a] to-teal-500'>
        <div className='container mx-auto lg:flex md:flex  items-center justify-center lg:gap-20 md:gap-5 '>
            <h3 className='animate__animated animate__backInUp text-white mt-10 mb-10 text-5xl ml-10 font-extrabold cursor-pointer'>For Remember Your Task<br /> <span className=''>Join Us</span></h3>
            <div className="text-white stats stats-vertical shadow lg:w-96 md:w-full w-80  mb-20 md:ml-5 text-center lg:mt-10">
  <div className="stat ">
    <div className="stat-title text-white">Our User</div>
    <div className="stat-value text-white">90k</div>
    <div className="stat-desc text-white">
    <p className='text-center text-white'>Jan 1st 21 to</p>
         <p className='text-center text-white'>{moment().format("MMM Do YY")}</p>
         </div>
  </div>

  <div className="stat text-white">
    <div className="stat-title text-white">Total Application </div>
    <div className="stat-value text-white">50k</div>
    <div className="stat-desc text-white">Read (92%)</div>
  </div>

  <div className="stat text-white">
    <div className="stat-title text-white">Total Scholarship</div>
    <div className="stat-value text-white">700k</div>
    <div className="stat-desc text-white">↘︎ Publish (75%)</div>
  </div>
  <div className="stat text-white">
    <div className="stat-title text-white">Our Follower</div>
    <div className="stat-value text-white">19M</div>
    <div className="stat-desc text-white">↘︎ Total view (95%)</div>
  </div>
</div>




<div className="carousel carousel-vertical rounded-box h-96 ">
  <div className="carousel-item h-full">
    <img className='w-full' src="https://i.ibb.co.com/B2MsBVMn/unnamed.png" />
  </div>
  <div className="carousel-item h-full">
    <img  className='w-full' src="https://i.ibb.co.com/RTKP34nz/sales-task-automation-illustration.png" />
  </div>
  <div className="carousel-item h-full">
    <img  className='w-full' src="https://i.ibb.co.com/kV8xRj5X/6473d8d02a3cf26273f2871e-6286de3f50c6ba9a73e000fd-Steps-To-Automate-Routine-Tasks-For-Multiple-Websi.jpg" />
  </div>
  <div className="carousel-item h-full">
    <img  className='w-full' src="https://i.ibb.co.com/qYBYK9dH/task-management-skills-blog-header-1.png" />
  </div>
 
</div>





        </div>
        </div>
        </div>
    );
};

export default Progress