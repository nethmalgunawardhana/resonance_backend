# 🎯 Resonance Frontend: Next.js Application

This is the Next.js frontend application for the Resonance project. It is a dynamic and responsive user interface built with Next.js and Tailwind CSS.

## 🚀 Features

* Dynamic and responsive UI using Next.js and Tailwind CSS
* Optimized font loading with `next/font` (Geist font)
* Integration with the Resonance backend

## 🛠️ Requirements

* Node.js (v14 or above)
* npm or yarn

## ⚙️ Setup Instructions

1.  **Clone the Repository**

    ```bash
    git clone [https://github.com/nethmalgunawardhana/resonance_backend.git](https://github.com/nethmalgunawardhana/resonance_backend.git) # Assuming both front and backend in same repo
    cd resonance_backend #  You might have a separate frontend folder.  Adjust as necessary.
    cd frontend # If your Next.js app is in a 'frontend' subdirectory
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**

    Create a `.env.local` file in the root of the frontend directory and add any necessary frontend environment variables.  Example:

    ```
    NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3000/api #  Or your actual backend URL
    ```

    **Important:** Do not commit your `.env.local` file to version control.  Add it to your `.gitignore` file.

4.  **Run the Application**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    This will start the Next.js development server.  Open your browser to the displayed URL (usually http://localhost:3000) to view the application.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 💻 Tech Stack (Frontend)

* Frontend: Next.js with Tailwind CSS

## 🤝 Team Members

* Tharin Edirisinghe
* Garuka Satharasinghe
* Nethmal Gunawardhana
* Harindu Hadithya
* Sachintha Lakmin
