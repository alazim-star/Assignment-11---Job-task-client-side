

const Footer = () => {
  return (
    <div className="bg-gradient-to-l from-pink-800 to-[#23085a] text-white">
      <footer className="container mx-auto p-6 md:p-10">
        {/* Footer Sections */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Services Section */}
          <nav>
            <h6 className="footer-title text-lg font-bold mb-4">Services</h6>
            <a className="link link-hover block text-sm md:text-base">Branding</a>
            <a className="link link-hover block text-sm md:text-base">Design</a>
            <a className="link link-hover block text-sm md:text-base">Marketing</a>
            <a className="link link-hover block text-sm md:text-base">Advertisement</a>
          </nav>

          {/* Company Section */}
          <nav>
            <h6 className="footer-title text-lg font-bold mb-4">Company</h6>
            <a className="link link-hover block text-sm md:text-base">About us</a>
            <a className="link link-hover block text-sm md:text-base">Contact</a>
            <a className="link link-hover block text-sm md:text-base">Jobs</a>
            <a className="link link-hover block text-sm md:text-base">Press kit</a>
          </nav>

          {/* Legal Section */}
          <nav>
            <h6 className="footer-title text-lg font-bold mb-4">Legal</h6>
            <a className="link link-hover block text-sm md:text-base">Terms of use</a>
            <a className="link link-hover block text-sm md:text-base">Privacy policy</a>
            <a className="link link-hover block text-sm md:text-base">Cookie policy</a>
          </nav>

          {/* Contact Section */}
          <nav className="flex flex-col">
            <h3 className="text-xl md:text-2xl text-gray-200 font-bold mb-4">
              Contact With Us
            </h3>
            <div className="flex gap-4 text-xl mb-4">
              <img
                className="w-8 h-8 md:w-10 md:h-10"
                src="https://i.ibb.co/QbDx2BH/icons8-youtube-48.png"
                alt="YouTube"
              />
              <img
                className="w-8 h-8 md:w-10 md:h-10"
                src="https://i.ibb.co/PZgyBM7/icons8-instagram-48.png"
                alt="Instagram"
              />
              <img
                className="w-8 h-8 md:w-10 md:h-10"
                src="https://i.ibb.co/0fG8g9z/icons8-fb-48.png"
                alt="Facebook"
              />
            </div>
            <h3 className="text-lg md:text-xl text-gray-200 font-bold">Find Us</h3>
            <div className="flex gap-6 mt-4">
              <img
                className="w-10 h-10" 
                src="https://i.ibb.co/5MbHtPN/playstore.png"
                alt="Google Play Store"
              />
              <img
                className="w-32"
                src="https://i.ibb.co/8DK7Z5b/Apple-play-store.png"
                alt="Apple App Store"
              />
            </div>
          </nav>
        </div>

        {/* Divider and Footer Bottom */}
        <div className="mt-10 text-center">
          <hr className="border-gray-400 mb-4" />
          <p className="text-sm md:text-base">
            © circle.com, Copyright 2025 - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
