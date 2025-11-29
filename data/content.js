/**
 * Portfolio Content Data
 * Centralized data structure for all experiences and projects
 * Makes it easy to update content without modifying HTML
 */

export const experiences = [
  {
    id: "stride-funding",
    company: "Clasp (FKA Stride Funding)",
    roles: [
      {
        title: "Senior Software Engineer",
        startDate: "Oct 2022",
        endDate: "Present",
        achievements: [
          "Mentoring a team of engineers, while continuing to be a high performing IC",
          "Architecting business-critical initiatives and leading implementation efforts"
        ]
      },
      {
        title: "Fullstack Software Engineer",
        startDate: "Feb 2022",
        endDate: "Oct 2022",
        achievements: [
          "Building the core platform - A full-stack multi-tenant application",
          "Tech stack: Docker, React, Node, NextJs, Typescript, Python, Django, Airflow, SQL, GCP"
        ]
      }
    ]
  },
  {
    id: "butcher-box",
    company: "ButcherBox",
    roles: [
      {
        title: "Software Engineer",
        startDate: "Oct 2020",
        endDate: "Feb 2022",
        achievements: [
          "Built an automated data quality pipeline to increase operating efficiency",
          "Implemented a fullstack application to optimize customer support workflow",
          "Tech stack: Docker, Python, SQL, Go, Airflow, React, NextJs, Typescript, Laravel"
        ]
      }
    ]
  },
  {
    id: "bank-of-america",
    company: "Bank of America",
    roles: [
      {
        title: "Big Data Engineer",
        startDate: "Jul 2019",
        endDate: "Oct 2020",
        achievements: [
          "Building near real-time and batch data ETL pipelines for public applications",
          "Designing backend infrastructures for data volumes of upto 300GB/day",
          "Tech stack: Hadoop, map-reduce, Hive, Sqoop, Spark and Oozie"
        ]
      }
    ]
  }
];

export const projects = {
  datascience: [
    {
      id: "love-at-first-swipe",
      title: "Love at First Swipe",
      description: "A Machine Learning project which predicts whether two people would match on a date",
      image: "img/projects/love_swipe.JPG",
      link: "https://hr23232323.github.io/love-at-first-swipe/",
      tags: ["Python", "Numpy", "Scikit-Learn", "Pandas", "Matplotlib", "Javascript"]
    },
    {
      id: "j-stroke",
      title: "J-Stroke: Basketball Analytics",
      description: "A data visualization dashboard to analyze and compare basketball players",
      image: "img/projects/j_stroke.JPG",
      link: "https://github.com/hr23232323/j_stroke",
      tags: ["Python", "Data Visualization", "Web Scraping", "D3.js", "Dashboard"]
    },
    {
      id: "fed-budget",
      title: "2016 Federal Budget Redesigned",
      description: "Redesign of the official 2016 federal budget breakdown into a multiview dashboard",
      image: "img/projects/fed_budget.JPG",
      link: "https://github.com/hr23232323/fed_budget_remix",
      tags: ["Python", "Data Visualization", "Data Wrangling", "D3.js", "Analytics"]
    }
  ],
  software: [
    {
      id: "wpi-global-map",
      title: "WPI Global Projects Map",
      description: "A web application which highlights WPI's project centers across the world",
      image: "img/projects/wpi_global_map.JPG",
      link: "https://projectcentersmap.wpi.edu/",
      tags: ["HTML", "CSS", "JavaScript", "PHP"]
    },
    {
      id: "human-perception",
      title: "Human Perception Experiment",
      description: "Recreation of Cleveland and McGill's experiment about human perception in data visualization",
      image: "img/projects/human_exp.JPG",
      link: "https://wpi-exp.netlify.com/",
      tags: ["HTML", "CSS", "JavaScript", "Python", "R", "D3.js", "Statistics"]
    },
    {
      id: "workout-buddy",
      title: "Workout Buddy",
      description: "A website to help people create and keep track of workouts",
      image: "img/projects/workout_buddy.JPG",
      link: "https://github.com/hr23232323/WorkoutBuddy",
      tags: ["HTML", "CSS", "JavaScript", "NodeJS", "SQLite"]
    }
  ]
};

/**
 * About section intro and closing text
 */
export const about = {
  intro: {
    education: "Worcester Polytechnic Institute",
    degree: "B.S. in Computer Science",
    minor: "Data Science"
  },
  passions: [
    "leveraging data to solve complex problems",
    "building impactful, clean & efficient software"
  ]
};
