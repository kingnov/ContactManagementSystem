interface IContact {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  class Contact implements IContact {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public phone: string
    ) {}
  }
  
  class ContactManager {
    private contacts: Contact[] = [];
    private currentEditId: string | null = null;
  
    constructor() {
      this.loadContacts();
      this.setupEventListeners();
      this.renderContacts();
    }
  
    private saveContacts(): void {
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
  
    private loadContacts(): void {
      const stored = localStorage.getItem('contacts');
      this.contacts = stored ? JSON.parse(stored) : [];
    }
  
    private generateId(): string {
      return Date.now().toString();
    }
  
    private setupEventListeners(): void {
      const form = document.getElementById('contactForm') as HTMLFormElement;
      const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
  
      form.onsubmit = (e) => {
        e.preventDefault();
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
  
        if (this.currentEditId) {
          this.updateContact(this.currentEditId, name, email, phone);
        } else {
          this.addContact(name, email, phone);
        }
        form.reset();
      };
  
      cancelBtn.onclick = () => {
        this.currentEditId = null;
        (document.getElementById('submitBtn') as HTMLButtonElement).textContent = 'Add Contact';
        cancelBtn.style.display = 'none';
        form.reset();
      };
    }
  
    private addContact(name: string, email: string, phone: string): void {
      const newContact = new Contact(this.generateId(), name, email, phone);
      this.contacts.push(newContact);
      this.saveContacts();
      this.renderContacts();
    }
  
    private updateContact(id: string, name: string, email: string, phone: string): void {
      const contact = this.contacts.find(c => c.id === id);
      if (contact) {
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
      }
      this.currentEditId = null;
      (document.getElementById('submitBtn') as HTMLButtonElement).textContent = 'Add Contact';
      (document.getElementById('cancelBtn') as HTMLButtonElement).style.display = 'none';
      this.saveContacts();
      this.renderContacts();
    }
  
    private deleteContact(id: string): void {
      this.contacts = this.contacts.filter(c => c.id !== id);
      this.saveContacts();
      this.renderContacts();
    }
  
    private editContact(id: string): void {
      const contact = this.contacts.find(c => c.id === id);
      if (contact) {
        (document.getElementById('name') as HTMLInputElement).value = contact.name;
        (document.getElementById('email') as HTMLInputElement).value = contact.email;
        (document.getElementById('phone') as HTMLInputElement).value = contact.phone;
        this.currentEditId = contact.id;
        (document.getElementById('submitBtn') as HTMLButtonElement).textContent = 'Update Contact';
        (document.getElementById('cancelBtn') as HTMLButtonElement).style.display = 'inline-block';
      }
    }
  
    private renderContacts(): void {
      const container = document.getElementById('contactsContainer') as HTMLElement;
      container.innerHTML = '';
  
      if (this.contacts.length === 0) {
        container.innerHTML = '<p class="noContacts">No contacts found.</p>';
        return;
      }
  
      this.contacts.forEach(contact => {
        const item = document.createElement('div');
        item.className = 'contactItem';
        item.innerHTML = `
          <div class="contactInfo">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
          </div>
          <div class="contactActions">
            <button class="btn btnEdit">Edit</button>
            <button class="btn btn-danger">Delete</button>
          </div>
        `;
  
        const buttons = Array.from(item.querySelectorAll('button')) as HTMLButtonElement[];
        const [editBtn, deleteBtn] = buttons;
                editBtn.addEventListener('click', () => this.editContact(contact.id));
        deleteBtn.addEventListener('click', () => this.deleteContact(contact.id));
  
        container.appendChild(item);
      });
    }
  }
  
  new ContactManager();
  