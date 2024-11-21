# Prosper Autowerks Website

The Prosper Autowerks website is a modern, customer-focused platform built for a local business in Sacramento, California. Prosper Autowerks specializes in car wrapping, tinting, paint protection film, and paint corrections. The website provides customers with a simple way to communicate their needs and learn about available services.

## Features

- **Service Inquiry Form**: Customers can outline their needs to help Prosper Autowerks provide tailored solutions.
- **Business Information**: Highlights Prosper Autowerks' services and expertise.
- **Future Enhancements**:
  - Automated car quote generation based on customer inputs.
  - Interactive tools for exploring service options and customizations.

## Purpose

The website aims to:
1. Establish Prosper Autowerks' online presence.
2. Simplify customer inquiries and initial service discussions.
3. Offer a foundation for future features like auto-quote generation and advanced customer engagement.

## Technologies Used

- **Frontend Framework**: Next.js for modern web application development.
- **Styling**: Tailwind CSS for a clean, responsive design.
- **Hosting**: Deployed on Vercel for fast and reliable delivery.
- **Environment Management**: Uses `.env` files to securely manage sensitive information.

## Local Development

To run this project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/StevenH01/prosper-auto.git
   cd prosper-auto

2. **Install Dependencies**

   ```bash
   npm install
3. **Set Environment Variables**
   Copy the .env.sample file and create a .env.local file:
   ```bash
   cp .env.sample .env.local
   ```
   Add your environment-specific configurations to the .env.local file.
4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser to view the site.

## Deployment

The website is deployed on [Vercel](https://vercel.com). To update the live site:
1. Push updates to the `main` branch (or the branch configured for deployment).
2. Ensure all required `.env` variables are correctly set in the Vercel dashboard under "Environment Variables."

## Contributing

Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## About Prosper Autowerks

Prosper Autowerks is a local business based in Sacramento, California, specializing in car wrapping, tinting, paint protection film, and paint corrections. This website reflects the company's dedication to providing exceptional service and convenient solutions for its customers.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
