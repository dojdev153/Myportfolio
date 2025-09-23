import { useState, useEffect } from 'react';
import { Mail, Eye, Check, Trash2, Clock, User, Calendar } from 'lucide-react';
import { contactAPI } from '../../lib/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  ipAddress?: string;
}

const ContactsPanel = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    loadContacts();
  }, [statusFilter]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const response = await contactAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 50
      });

      if (response.success) {
        setContacts(response.contacts);
      } else {
        throw new Error(response.message || 'Failed to load contacts');
      }
    } catch (error: any) {
      console.error('Contacts loading error:', error);
      
      // Mock data for demonstration
      setContacts([
        {
          _id: '1',
          name: 'John Developer',
          email: 'john@example.com',
          subject: 'Interested in your work',
          message: 'Hi Frank, I love your portfolio design and would like to discuss a potential project collaboration...',
          status: 'unread',
          createdAt: new Date().toISOString(),
          ipAddress: '192.168.1.1'
        },
        {
          _id: '2',
          name: 'Sarah Client',
          email: 'sarah@company.com',
          subject: 'Job Opportunity',
          message: 'We have an exciting full-stack developer position that might interest you...',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          ipAddress: '10.0.0.1'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await contactAPI.updateStatus(contactId, newStatus);
      setContacts(prev => prev.map(contact => 
        contact._id === contactId ? { ...contact, status: newStatus } : contact
      ));
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactAPI.delete(contactId);
      setContacts(prev => prev.filter(contact => contact._id !== contactId));
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'cyber-blue';
      case 'read': return 'cyber-yellow';
      case 'replied': return 'cyber-green';
      default: return 'gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Mail size={14} />;
      case 'read': return <Eye size={14} />;
      case 'replied': return <Check size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-tech">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Contacts List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Filters */}
        <div className="hologram rounded-lg p-4">
          <div className="flex gap-2 mb-4">
            {(['all', 'unread', 'read', 'replied'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg text-sm font-tech transition-all duration-300 ${
                  statusFilter === filter
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-400 font-tech">
            {contacts.length} message{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Messages List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => setSelectedContact(contact)}
              className={`hologram rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedContact?._id === contact._id ? 'border-cyber-blue/50 bg-cyber-blue/5' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyber-blue/20 rounded-full flex items-center justify-center">
                    <User size={14} className="text-cyber-blue" />
                  </div>
                  <div>
                    <h4 className="font-tech font-semibold text-white text-sm truncate">
                      {contact.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-tech truncate">
                      {contact.email}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-1 text-xs text-${getStatusColor(contact.status)}`}>
                  {getStatusIcon(contact.status)}
                  <span className="font-tech">{contact.status}</span>
                </div>
              </div>
              
              <h5 className="font-tech text-sm text-gray-300 mb-1 truncate">
                {contact.subject}
              </h5>
              
              <p className="text-xs text-gray-500 font-tech line-clamp-2">
                {contact.message}
              </p>
              
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                <Calendar size={12} />
                <span className="font-tech">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail size={20} className="text-gray-500" />
              </div>
              <p className="text-gray-500 font-tech text-sm">No messages found</p>
              <p className="text-gray-600 font-tech text-xs mt-1">
                Messages will appear here when visitors contact you
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selectedContact ? (
          <div className="hologram rounded-lg p-6 h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyber-blue/20 rounded-full flex items-center justify-center">
                  <User size={20} className="text-cyber-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-cyber font-bold text-white">
                    {selectedContact.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-tech">{selectedContact.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs text-${getStatusColor(selectedContact.status)} font-tech`}>
                      {selectedContact.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500 font-tech">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <select
                  value={selectedContact.status}
                  onChange={(e) => handleStatusChange(selectedContact._id, e.target.value as any)}
                  className="px-3 py-1 bg-cyber-dark border border-cyber-blue/30 rounded text-sm text-white font-tech"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
                
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <h4 className="text-sm font-tech text-gray-400 mb-2">Subject</h4>
              <p className="text-lg font-tech text-white">{selectedContact.subject}</p>
            </div>

            {/* Message */}
            <div className="mb-6">
              <h4 className="text-sm font-tech text-gray-400 mb-2">Message</h4>
              <div className="bg-cyber-dark/30 rounded-lg p-4 border border-cyber-blue/20">
                <p className="text-gray-300 font-tech leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            {/* Technical Info */}
            {selectedContact.ipAddress && (
              <div className="text-xs text-gray-500 font-tech">
                <p>IP Address: {selectedContact.ipAddress}</p>
              </div>
            )}

            {/* Reply Button */}
            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                className="cyber-button px-6 py-2 text-sm"
              >
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="hologram rounded-lg p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyber-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-cyber-blue" />
              </div>
              <h3 className="text-lg font-cyber font-bold text-cyber-blue mb-2">
                Select a Message
              </h3>
              <p className="text-gray-400 font-tech text-sm">
                Choose a message from the list to view its details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPanel;
