
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './BudgetPage.css';

const BudgetPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/events/booking/${eventId}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        setEvent(data.event); // adjust according to your backend structure
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event.');
      }
    };
  
    fetchEvent();
  }, []);
  

  const handleAddItem = () => {
    setItems([
      ...items,
      { category: 'Food', item_name: '', quantity: 1, unit_price: 0, total_price: 0 },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'quantity' || field === 'unit_price' ? Number(value) : value;
    updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].unit_price;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    for (let item of items) {
      if (!item.category || !item.item_name || item.quantity <= 0 || item.unit_price < 0) {
        setError('Please fill out all fields correctly.');
        return;
      }
    }

    try {
      const res = await axios.post(`http://localhost:3001/api/budgets/${eventId}`, { items });
      setSuccess('Budget submitted successfully.');
      setStatus(res.data.budget.status);
    } catch (err) {
      console.error('Error submitting budget:', err);
      setError('Failed to submit budget.');
    }
  };

  const totalBudget = items.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <div className="budget-page">
     <h2>Budget for Event: {event?.event_name || 'Loading...'}</h2>



      <p>Status: <strong>{status}</strong></p>

      {status === 'pending' || status === 'hold' ? (
        <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                    >
                      <option value="Food">Food</option>
                      <option value="Logistic">Logistic</option>
                      <option value="Transport">Transport</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      min="1"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                      min="0"
                      required
                    />
                  </td>
                  <td>{item.total_price.toFixed(2)}</td>
                  <td>
                    <button type="button" onClick={() => handleRemoveItem(idx)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddItem}>Add Item</button>
          <h3>Total Budget: {totalBudget.toFixed(2)}</h3>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit">Submit Budget</button>
        </form>
      ) : (
        <p>Budget editing is not allowed in the current status.</p>
      )}
    </div>
  );
};

export default BudgetPage;
