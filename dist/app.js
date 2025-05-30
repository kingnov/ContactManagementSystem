"use strict";
class Contact {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
class ContactManager {
    constructor() {
        this.contacts = [];
        this.currentEditId = null;
        this.loadContacts();
        this.setupEventListeners();
        this.renderContacts();
    }
    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
    loadContacts() {
        const stored = localStorage.getItem('contacts');
        this.contacts = stored ? JSON.parse(stored) : [];
    }
    generateId() {
        return Date.now().toString();
    }
    setupEventListeners() {
        const form = document.getElementById('contactForm');
        const cancelBtn = document.getElementById('cancelBtn');
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            if (this.currentEditId) {
                this.updateContact(this.currentEditId, name, email, phone);
            }
            else {
                this.addContact(name, email, phone);
            }
            form.reset();
        };
        cancelBtn.onclick = () => {
            this.currentEditId = null;
            document.getElementById('submitBtn').textContent = 'Add Contact';
            cancelBtn.style.display = 'none';
            form.reset();
        };
    }
    addContact(name, email, phone) {
        const newContact = new Contact(this.generateId(), name, email, phone);
        this.contacts.push(newContact);
        this.saveContacts();
        this.renderContacts();
    }
    updateContact(id, name, email, phone) {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
            contact.name = name;
            contact.email = email;
            contact.phone = phone;
        }
        this.currentEditId = null;
        document.getElementById('submitBtn').textContent = 'Add Contact';
        document.getElementById('cancelBtn').style.display = 'none';
        this.saveContacts();
        this.renderContacts();
    }
    deleteContact(id) {
        this.contacts = this.contacts.filter(c => c.id !== id);
        this.saveContacts();
        this.renderContacts();
    }
    editContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
            document.getElementById('name').value = contact.name;
            document.getElementById('email').value = contact.email;
            document.getElementById('phone').value = contact.phone;
            this.currentEditId = contact.id;
            document.getElementById('submitBtn').textContent = 'Update Contact';
            document.getElementById('cancelBtn').style.display = 'inline-block';
        }
    }
    renderContacts() {
        const container = document.getElementById('contactsContainer');
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
            const buttons = Array.from(item.querySelectorAll('button'));
            const [editBtn, deleteBtn] = buttons;
            editBtn.addEventListener('click', () => this.editContact(contact.id));
            deleteBtn.addEventListener('click', () => this.deleteContact(contact.id));
            container.appendChild(item);
        });
    }
}
new ContactManager();
