import React, { useEffect, useState } from 'react'
import api from './api'

const money = v => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const blankStudent = { fullName: '', admissionNumber: '', className: '', email: '', phone: '' }

export default function App() {
  const [tab, setTab] = useState('Dashboard')
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState({})
  const [studentForm, setStudentForm] = useState(blankStudent)
  const [feeForm, setFeeForm] = useState({ feeName: '', amount: '', academicYear: '2026-2027', active: true })
  const [payForm, setPayForm] = useState({ studentId: '', feeStructureId: '', amountPaid: '', paymentMethod: 'CASH' })
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadAll() {
    try {
      const [s, f, p, d] = await Promise.all([
        api.get('/students'), api.get('/fee-structures'), api.get('/payments'), api.get('/dashboard')
      ])
      setStudents(s.data); setFees(f.data); setPayments(p.data); setSummary(d.data)
    } catch (e) { setNotice(errorText(e)) }
  }
  useEffect(() => { loadAll() }, [])
  function errorText(e) { return e?.response?.data?.message || e?.message || 'Something went wrong' }
  async function run(action, success) {
    setBusy(true); setNotice('')
    try { await action(); await loadAll(); setNotice(success) }
    catch (e) { setNotice(errorText(e)) }
    finally { setBusy(false) }
  }
  async function addStudent(e) {
    e.preventDefault()
    await run(() => api.post('/students', studentForm), 'Student added successfully.')
    setStudentForm(blankStudent)
  }
  async function deleteStudent(id) {
    if (!confirm('Delete this student? Students with payment history may not be deletable.')) return
    await run(() => api.delete(`/students/${id}`), 'Student deleted.')
  }
  async function addFee(e) {
    e.preventDefault()
    await run(() => api.post('/fee-structures', { ...feeForm, amount: Number(feeForm.amount) }), 'Fee structure added.')
    setFeeForm({ feeName: '', amount: '', academicYear: '2026-2027', active: true })
  }
  async function addPayment(e) {
    e.preventDefault()
    await run(() => api.post('/payments', { ...payForm, studentId: Number(payForm.studentId),
      feeStructureId: Number(payForm.feeStructureId), amountPaid: Number(payForm.amountPaid) }),
      'Demo payment recorded. No real money was collected.')
    setPayForm({ studentId: '', feeStructureId: '', amountPaid: '', paymentMethod: 'CASH' })
  }

  const nav = ['Dashboard', 'Students', 'Fee Structure', 'Payments']
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="logo">SF</div><div><b>SchoolPay</b><small>Fee Management</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      {nav.map(n => <button key={n} className={`nav ${tab === n ? 'selected' : ''}`} onClick={() => setTab(n)}>
        <span>{({Dashboard:'▦', Students:'♙', 'Fee Structure':'▤', Payments:'₹'})[n]}</span>{n}
      </button>)}
      <div className="side-bottom"><span className="status-dot"/> Local demo application <small>Spring Boot + React</small></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><div className="eyebrow">SCHOOL ADMINISTRATION</div><h1>{tab}</h1></div>
        <div className="admin"><div className="avatar">A</div><div><b>Administrator</b><small>Project demo</small></div></div>
      </header>
      {notice && <div className={`notice ${notice.toLowerCase().includes('success') || notice.toLowerCase().includes('added') || notice.toLowerCase().includes('recorded') || notice.toLowerCase().includes('deleted') ? 'ok' : 'error'}`}>
        {notice}<button onClick={() => setNotice('')}>×</button></div>}
      {tab === 'Dashboard' && <section>
        <div className="welcome"><div><span className="pill">OVERVIEW</span><h2>School fee overview</h2><p>Track students, fee structures and recorded payments in one place.</p></div><div className="welcome-icon">₹</div></div>
        <div className="stats">
          <Stat title="Total students" value={summary.studentCount ?? 0} icon="♙" tone="blue"/>
          <Stat title="Fee structures" value={summary.feeStructureCount ?? 0} icon="▤" tone="purple"/>
          <Stat title="Fees collected" value={money(summary.totalCollected)} icon="↗" tone="green"/>
          <Stat title="Outstanding (estimate)" value={money(summary.outstanding)} icon="◷" tone="orange"/>
        </div>
        <div className="panel"><div className="panel-head"><div><h3>Recent payments</h3><p>Latest recorded fee transactions</p></div><button className="secondary" onClick={() => setTab('Payments')}>View all →</button></div>
          <PaymentTable rows={[...payments].reverse().slice(0, 5)}/></div>
      </section>}
      {tab === 'Students' && <section className="two-col">
        <div className="panel"><div className="panel-head"><div><h3>Add a student</h3><p>Enter student details below</p></div></div>
          <form onSubmit={addStudent} className="form">
            <Field label="Full name" value={studentForm.fullName} required onChange={v=>setStudentForm({...studentForm,fullName:v})} placeholder="e.g. Ananya Rao"/>
            <Field label="Admission number" value={studentForm.admissionNumber} required onChange={v=>setStudentForm({...studentForm,admissionNumber:v})} placeholder="e.g. ADM-2026-001"/>
            <Field label="Class / Grade" value={studentForm.className} required onChange={v=>setStudentForm({...studentForm,className:v})} placeholder="e.g. Class 8"/>
            <Field label="Email" type="email" value={studentForm.email} onChange={v=>setStudentForm({...studentForm,email:v})} placeholder="student@example.com"/>
            <Field label="Phone" value={studentForm.phone} onChange={v=>setStudentForm({...studentForm,phone:v})} placeholder="Phone number"/>
            <button className="primary" disabled={busy}>＋ Add student</button>
          </form>
        </div>
        <div className="panel"><div className="panel-head"><div><h3>Student directory</h3><p>{students.length} students registered</p></div></div><StudentTable rows={students} onDelete={deleteStudent}/></div>
      </section>}
      {tab === 'Fee Structure' && <section className="two-col">
        <div className="panel"><div className="panel-head"><div><h3>Create fee type</h3><p>Set up tuition or other charges</p></div></div>
          <form onSubmit={addFee} className="form">
            <Field label="Fee name" value={feeForm.feeName} required onChange={v=>setFeeForm({...feeForm,feeName:v})} placeholder="e.g. Tuition Fee"/>
            <Field label="Amount (₹)" type="number" min="0.01" value={feeForm.amount} required onChange={v=>setFeeForm({...feeForm,amount:v})} placeholder="e.g. 15000"/>
            <Field label="Academic year" value={feeForm.academicYear} onChange={v=>setFeeForm({...feeForm,academicYear:v})} placeholder="2026-2027"/>
            <button className="primary" disabled={busy}>＋ Save fee structure</button>
          </form>
        </div>
        <div className="panel"><div className="panel-head"><div><h3>Fee types</h3><p>Configured fee amounts</p></div></div>
          {fees.length ? <div className="table-wrap"><table><thead><tr><th>Fee name</th><th>Academic year</th><th>Amount</th><th>Status</th></tr></thead><tbody>{fees.map(f=><tr key={f.id}><td><b>{f.feeName}</b></td><td>{f.academicYear || '—'}</td><td>{money(f.amount)}</td><td><span className="tag">{f.active?'Active':'Inactive'}</span></td></tr>)}</tbody></table></div> : <Empty text="No fee structures created yet."/>}
        </div>
      </section>}
      {tab === 'Payments' && <section className="two-col">
        <div className="panel"><div className="panel-head"><div><h3>Record a fee payment</h3><p>For demonstration and testing only</p></div></div>
          <div className="warning">Demo mode: this form records a payment entry. It does not charge a card or transfer money.</div>
          <form onSubmit={addPayment} className="form">
            <label>Student<select required value={payForm.studentId} onChange={e=>setPayForm({...payForm,studentId:e.target.value})}><option value="">Choose student</option>{students.map(s=><option key={s.id} value={s.id}>{s.fullName} ({s.admissionNumber})</option>)}</select></label>
            <label>Fee type<select required value={payForm.feeStructureId} onChange={e=>{const f=fees.find(x=>String(x.id)===e.target.value);setPayForm({...payForm,feeStructureId:e.target.value,amountPaid:f?String(f.amount):payForm.amountPaid})}}><option value="">Choose fee</option>{fees.filter(f=>f.active).map(f=><option key={f.id} value={f.id}>{f.feeName} — {money(f.amount)}</option>)}</select></label>
            <Field label="Amount paid (₹)" type="number" min="0.01" value={payForm.amountPaid} required onChange={v=>setPayForm({...payForm,amountPaid:v})} placeholder="Enter amount"/>
            <label>Payment method<select value={payForm.paymentMethod} onChange={e=>setPayForm({...payForm,paymentMethod:e.target.value})}><option>CASH</option><option>UPI (demo)</option><option>BANK TRANSFER (demo)</option><option>ONLINE (demo)</option></select></label>
            <button className="primary" disabled={busy || !students.length || !fees.some(f=>f.active)}>Record demo payment</button>
          </form>
        </div>
        <div className="panel"><div className="panel-head"><div><h3>Payment history</h3><p>{payments.length} payment records</p></div></div><PaymentTable rows={[...payments].reverse()}/></div>
      </section>}
      <footer>SchoolPay · B.Tech project starter · Use sample data only</footer>
    </main>
  </div>
}

function Stat({title,value,icon,tone}) { return <div className="stat"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-foot">Updated from database</div></div> }
function Field({label,value,onChange,placeholder,type='text',required=false,min}) { return <label>{label}<input type={type} min={min} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required}/></label> }
function Empty({text}) { return <div className="empty"><div>▤</div>{text}</div> }
function StudentTable({rows,onDelete}) {
  if (!rows.length) return <Empty text="No students yet. Add the first student using the form."/>
  return <div className="table-wrap"><table><thead><tr><th>Student</th><th>Admission no.</th><th>Class</th><th>Action</th></tr></thead><tbody>{rows.map(s=><tr key={s.id}><td><b>{s.fullName}</b><small className="cell-sub">{s.email || s.phone || 'No contact'}</small></td><td>{s.admissionNumber}</td><td>{s.className}</td><td><button className="delete" onClick={()=>onDelete(s.id)}>Delete</button></td></tr>)}</tbody></table></div>
}
function PaymentTable({rows}) {
  if (!rows.length) return <Empty text="No payments recorded yet."/>
  return <div className="table-wrap"><table><thead><tr><th>Receipt</th><th>Student</th><th>Fee type</th><th>Amount</th><th>Date</th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td><span className="receipt">{p.receiptNumber}</span></td><td><b>{p.student?.fullName || '—'}</b></td><td>{p.feeStructure?.feeName || '—'}</td><td><b>{money(p.amountPaid)}</b></td><td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div>
}
