interface ResumeData {
  name: string;
  about: string;
  email: string;
  phone: string;
  linkedin: string;
  facebook: string;
  discord: string;
  github: string;
  skills: string[];
  experience: {
    title: string;
    dates: string;
    description: string;
  }[];
  heroDescription: string;
  image: string | ArrayBuffer;
}

const resumeForm = document.getElementById('resume-form') as HTMLFormElement | null;
const resumeDisplayContainer = document.getElementById('resume-display') as HTMLElement | null;
const imageInput = document.getElementById('image') as HTMLInputElement | null;

if (resumeForm && resumeDisplayContainer) {
  resumeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const aboutTextArea = document.getElementById('about') as HTMLTextAreaElement | null;
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const phoneInput = document.getElementById('phone') as HTMLInputElement | null;
    const linkedinInput = document.getElementById('linkedin') as HTMLInputElement | null;
    const facebookInput = document.getElementById('facebook') as HTMLInputElement | null;
    const discordInput = document.getElementById('discord') as HTMLInputElement | null;
    const githubInput = document.getElementById('github') as HTMLInputElement | null;
    const skillsInput = document.getElementById('skills') as HTMLInputElement | null;
    const experienceTitleInput = document.getElementById('experience-title') as HTMLInputElement | null;
    const experienceDatesInput = document.getElementById('experience-dates') as HTMLInputElement | null;
    const experienceDescriptionTextArea = document.getElementById('experience-description') as HTMLTextAreaElement | null;
    const heroDescriptionInput = document.getElementById('hero-description') as HTMLInputElement | null;

    if (
      nameInput && aboutTextArea && emailInput && phoneInput && linkedinInput &&
      facebookInput && discordInput && githubInput && skillsInput &&
      experienceTitleInput && experienceDatesInput && experienceDescriptionTextArea &&
      heroDescriptionInput && imageInput && imageInput.files && imageInput.files.length > 0
    ) {
      const file = imageInput.files[0]; // Get the file from input
      const reader = new FileReader();

      reader.onload = function(event) {
        const result = event.target?.result;
        if (typeof result === 'string') { // Ensure result is a string
          const resumeData: ResumeData = {
            name: nameInput.value,
            about: aboutTextArea.value,
            email: emailInput.value,
            phone: phoneInput.value,
            linkedin: linkedinInput.value,
            facebook: facebookInput.value,
            discord: discordInput.value,
            github: githubInput.value,
            skills: skillsInput.value.split(',').map(skill => skill.trim()),
            experience: [{
              title: experienceTitleInput.value,
              dates: experienceDatesInput.value,
              description: experienceDescriptionTextArea.value
            }],
            heroDescription: heroDescriptionInput.value,
            image: result // Convert to base64 string
          };

          generateResume(resumeData); // Call the function to generate resume
        } else {
          console.error('Error reading image file.');
        }
      };

      reader.onerror = function() {
        console.error('Error reading file.');
      };

      reader.readAsDataURL(file); // Convert file to base64 URL
    } else {
      console.error('Please fill all fields and upload an image.');
    }
  });
}

// Extend the generateResume function to make sections editable
function generateResume(data: ResumeData) {
  if (resumeDisplayContainer) {
    const imageElement = data.image ? `<img src="${data.image}" alt="Profile Image" class="profile-image"/>` : '';

    resumeDisplayContainer.innerHTML = `
      <header class="navbar">
        <h1 id="name" contenteditable="true">${data.name}</h1>
        <ul id="links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </header>

      <div class="hero">
        <div class="hero-content">
          ${imageElement}
          <h1 id="hero-description" contenteditable="true">${data.heroDescription}</h1>
          <div class="icons">
            ${data.facebook ? `<a href="${data.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank"><i class="fa-brands fa-linkedin"></i></a>` : ''}
            ${data.discord ? `<a href="${data.discord}" target="_blank"><i class="fa-brands fa-discord"></i></a>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank"><i class="fa-brands fa-github"></i></a>` : ''}
          </div>
        </div>
      </div>

      <main>
        <section id="about" class="section">
          <h2 class="section-title">About Me</h2>
          <p id="about" class="section-content" contenteditable="true">${data.about}</p>
        </section>

        <section id="skills" class="section">
          <h2 class="section-title">Skills</h2>
          <ul id="skills-list" class="skills-list" contenteditable="true">
            ${data.skills.map(skill => `<li contenteditable="true"><i class="fa-solid fa-check" style="color: #199f34;"></i> ${skill}</li>`).join('')}
          </ul>
        </section>

        <section id="experience" class="section">
          <h2 class="section-title">Experience</h2>
          <div class="experience-item">
            <h3 id="experience-title" contenteditable="true">${data.experience[0].title}</h3>
            <p id="experience-dates" class="dates" contenteditable="true">${data.experience[0].dates}</p>
            <p id="experience-description" contenteditable="true">${data.experience[0].description}</p>
          </div>
        </section>

        <section id="contact" class="section">
          <h2 class="section-title">Contact Details</h2>
          <p id="email" class="section-content" contenteditable="true"><i class="fa-solid fa-envelope"></i> Email: ${data.email}</p>
          <p id="phone" class="section-content" contenteditable="true"><i class="fa-solid fa-phone"></i> Phone: ${data.phone}</p>
          <p id="linkedin-contact" class="section-content" contenteditable="true"><i class="fa-brands fa-linkedin"></i> LinkedIn: <a href="${data.linkedin}" target="_blank">${data.linkedin}</a></p>
        </section>
      </main>
    `;

    // Make the form hidden and show the resume
    resumeForm?.classList.add('hidden');
    resumeDisplayContainer.classList.remove('hidden');

    // Add listeners to update resume data on edit
    addEditListeners(data);
  }
}




// Function to add event listeners for editing the resume
function addEditListeners(data: ResumeData) {
  const elementsToEdit = [
    { id: 'name', key: 'name' },
    { id: 'hero-description', key: 'heroDescription' },
    { id: 'about', key: 'about' },
    { id: 'experience-title', key: 'experience[0].title' },
    { id: 'experience-dates', key: 'experience[0].dates' },
    { id: 'experience-description', key: 'experience[0].description' },
    { id: 'email', key: 'email' },
    { id: 'phone', key: 'phone' },
  ];

  elementsToEdit.forEach(({ id, key }) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', (event) => {
        const target = event.target as HTMLElement;
        if (target) {
          // Update the data object based on the edits
          if (key.indexOf('experience') === 0) {  // Use indexOf instead of startsWith
            const experienceField = key.split('.')[1];
            data.experience[0][experienceField] = target.innerText;
          } else {
            (data as any)[key] = target.innerText;
          }
        }
      });
    }
  });

  // Update skills
  const skillsList = document.getElementById('skills-list');
  if (skillsList) {
    skillsList.addEventListener('input', () => {
      data.skills = [].slice.call(skillsList.querySelectorAll('li')).map((item: HTMLElement) =>
        item.textContent?.trim() || ''
      );
    });
  }
}
