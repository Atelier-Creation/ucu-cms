import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ContactEditor() {
  const [contacts, setContacts] = useState([
    { id: 1, department: "Admissions Office", email: "admissions@ucu.edu", phone: "+91 98765 43210" },
    { id: 2, department: "Support Desk", email: "support@ucu.edu", phone: "+91 98765 43211" },
  ]);

  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com/ucu",
    linkedin: "https://linkedin.com/school/ucu",
    instagram: "https://instagram.com/ucu",
  });

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleContactChange = (id, field, value) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddContact = () => {
    setContacts(prev => [
      ...prev,
      { id: Date.now(), department: "", email: "", phone: "" },
    ]);
  };

  const handleRemoveContact = id => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = () => {
    console.log({
      contacts,
      formFields,
      socialLinks,
    });
    alert("✅ Contact page data saved (mock)!");
  };

  return (
    <div className="space-y-6">
      {/* Admissions & Support Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>📞 Admission & Support Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map(contact => (
            <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Department"
                value={contact.department}
                onChange={e => handleContactChange(contact.id, "department", e.target.value)}
              />
              <Input
                placeholder="Email"
                value={contact.email}
                onChange={e => handleContactChange(contact.id, "email", e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={contact.phone}
                onChange={e => handleContactChange(contact.id, "phone", e.target.value)}
              />
              <div className="col-span-full flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveContact(contact.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={handleAddContact} variant="outline">
            + Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Inquiry Form */}
      <Card>
        <CardHeader>
          <CardTitle>💬 Inquiry Form Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Name"
            value={formFields.name}
            onChange={e => setFormFields({ ...formFields, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={formFields.email}
            onChange={e => setFormFields({ ...formFields, email: e.target.value })}
          />
          <Input
            placeholder="Subject"
            value={formFields.subject}
            onChange={e => setFormFields({ ...formFields, subject: e.target.value })}
          />
          <Textarea
            placeholder="Message"
            value={formFields.message}
            onChange={e => setFormFields({ ...formFields, message: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>🔗 Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Facebook URL"
            value={socialLinks.facebook}
            onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
          />
          <Input
            placeholder="LinkedIn URL"
            value={socialLinks.linkedin}
            onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
          />
          <Input
            placeholder="Instagram URL"
            value={socialLinks.instagram}
            onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Contact Info
        </Button>
      </div>
    </div>
  );
}
