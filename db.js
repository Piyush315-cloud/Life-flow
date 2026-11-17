const LifeFlowDB = {

  donors: JSON.parse(localStorage.getItem('lf_donors')) || [
    { id: 1, name: "Piyush kumar",   blood: "A+",  age: 28, city: "Mumbai",    phone: "98201-11234", lastDonation: "2024-10-12", donations: 5,  status: "eligible" },
    { id: 2, name: "deepak Sharma",  blood: "O-",  age: 34, city: "Delhi",     phone: "91234-56789", lastDonation: "2025-01-08", donations: 9,  status: "eligible" },
    { id: 3, name: "Rohan ",     blood: "B+",  age: 22, city: "Kolkata",   phone: "87654-32100", lastDonation: "2025-03-20", donations: 2,  status: "cooldown" },
    { id: 4, name: "Sneha Iyer",    blood: "AB+", age: 30, city: "Bangalore", phone: "76543-21098", lastDonation: "2024-07-15", donations: 7,  status: "eligible" },
    { id: 5, name: "Vikram Nair",   blood: "O+",  age: 45, city: "Chennai",   phone: "65432-10987", lastDonation: "2025-02-28", donations: 14, status: "eligible" },
    { id: 6, name: "Ananya Gupta",  blood: "A-",  age: 26, city: "Hyderabad", phone: "54321-09876", lastDonation: "2025-04-01", donations: 3,  status: "cooldown" },
    { id: 7, name: "Kiran Patel",   blood: "B-",  age: 38, city: "Ahmedabad", phone: "43210-98765", lastDonation: "2024-11-22", donations: 11, status: "eligible" },
    { id: 8, name: "Meera Joshi",   blood: "AB-", age: 31, city: "Pune",      phone: "32109-87654", lastDonation: "2025-01-30", donations: 6,  status: "eligible" },
  ],

  inventory: JSON.parse(localStorage.getItem('lf_inventory')) || [
    { type: "A+",  units: 312, capacity: 400 },
    { type: "A-",  units: 98,  capacity: 250 },
    { type: "B+",  units: 201, capacity: 350 },
    { type: "B-",  units: 44,  capacity: 250 },
    { type: "O+",  units: 380, capacity: 430 },
    { type: "O-",  units: 89,  capacity: 400 },
    { type: "AB+", units: 180, capacity: 200 },
    { type: "AB-", units: 61,  capacity: 200 },
  ],

  requests: JSON.parse(localStorage.getItem('lf_requests')) || [
    { id: 1, hospital: "City General Hospital", blood: "O-",  units: 5, urgency: "critical", status: "pending",   date: "2025-05-20", notes: "Emergency surgery" },
    { id: 2, hospital: "Apollo Medical Centre", blood: "A+",  units: 3, urgency: "urgent",   status: "fulfilled", date: "2025-05-22", notes: "Scheduled transfusion" },
    { id: 3, hospital: "St. Mary's Clinic",     blood: "B+",  units: 2, urgency: "normal",   status: "approved",  date: "2025-05-23", notes: "Elective procedure" },
    { id: 4, hospital: "AIIMS Delhi",           blood: "AB+", units: 8, urgency: "critical", status: "fulfilled", date: "2025-05-19", notes: "Accident victim" },
    { id: 5, hospital: "Fortis Hospital",       blood: "O+",  units: 4, urgency: "urgent",   status: "pending",   date: "2025-05-24", notes: "Oncology dept." },
  ],

  save() {
    localStorage.setItem('lf_donors',    JSON.stringify(this.donors));
    localStorage.setItem('lf_inventory', JSON.stringify(this.inventory));
    localStorage.setItem('lf_requests',  JSON.stringify(this.requests));
  },

  addDonor(donor) {
    donor.id = Date.now();
    this.donors.unshift(donor);
    this.save();
  },

  removeDonor(id) {
    this.donors = this.donors.filter(d => d.id !== id);
    this.save();
  },

  adjustInventory(type, delta) {
    const item = this.inventory.find(i => i.type === type);
    if (item) {
      item.units = Math.max(0, Math.min(item.capacity, item.units + delta));
      this.save();
    }
  },

  addRequest(req) {
    req.id   = Date.now();
    req.date = new Date().toISOString().split('T')[0];
    this.requests.unshift(req);
    this.save();
  },

  updateRequestStatus(id, status) {
    const req = this.requests.find(r => r.id === id);
    if (req) {
      if (status === 'fulfilled') {
        this.adjustInventory(req.blood, -req.units);
      }
      req.status = status;
      this.save();
    }
  }
};