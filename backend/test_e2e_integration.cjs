const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runTests() {
  console.log('🚀 Starting MediConnect End-to-End API Integration Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
    }
  }

  // 1. Admin Login
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@mediconnect.com', password: 'admin123' })
  });
  assert(adminLogin.status === 200 && adminLogin.data.role === 'ADMIN', 'Admin login succeeds and identifies ADMIN role');

  // 2. Doctor Login
  const docLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'dr.sarah@mediconnect.com', password: 'doctor123' })
  });
  assert(docLogin.status === 200 && docLogin.data.role === 'DOCTOR' && docLogin.data.doctorId === 1, 'Doctor login returns doctorId and DOCTOR role');

  // 3. Patient Login
  const patLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'john.doe@mediconnect.com', password: 'patient123' })
  });
  assert(patLogin.status === 200 && patLogin.data.role === 'PATIENT' && patLogin.data.patientId === 1, 'Patient login returns patientId and PATIENT role');

  // 4. Register New Patient
  const uniqueEmail = `test.patient.${Date.now()}@example.com`;
  const registerPatient = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Alice Williams',
      email: uniqueEmail,
      password: 'password123',
      role: 'PATIENT',
      phone: '+1 555-4321',
      age: 29,
      gender: 'Female',
      address: '101 Pine St'
    })
  });
  assert(registerPatient.status === 201 && registerPatient.data.patientId != null, 'Patient registration creates User and Patient records');
  const newPatientId = registerPatient.data.patientId;

  // 5. Query Doctors with filters
  const allDocs = await request('/doctors');
  assert(allDocs.status === 200 && Array.isArray(allDocs.data) && allDocs.data.length >= 4, 'GET /doctors returns list of active doctors');

  const cardioDocs = await request('/doctors?specialization=Cardiology');
  assert(cardioDocs.status === 200 && cardioDocs.data.every(d => d.specialization === 'Cardiology'), 'Filter doctors by specialization works');

  const searchDocs = await request('/doctors?query=Sarah');
  assert(searchDocs.status === 200 && searchDocs.data.some(d => d.name.includes('Sarah')), 'Search doctors by query matches doctor name');

  // 6. Doctor Availability
  const availabilities = await request('/doctors/1/availability');
  assert(availabilities.status === 200 && availabilities.data.length > 0, 'GET /doctors/{id}/availability returns scheduled slots');
  const slotDate = availabilities.data[0].date;

  // 7. Book appointment
  const bookRes = await request('/appointments', {
    method: 'POST',
    body: JSON.stringify({
      patientId: newPatientId,
      doctorId: 1,
      appointmentDate: slotDate,
      appointmentTime: '12:00',
      reason: 'Routine cardiovascular checkup'
    })
  });
  assert(bookRes.status === 201 && bookRes.data.status === 'PENDING', 'Appointment booking succeeds with PENDING status');
  const apptId = bookRes.data.id;

  // 8. Prevent Double Booking
  const doubleBookRes = await request('/appointments', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 1,
      doctorId: 1,
      appointmentDate: slotDate,
      appointmentTime: '12:00',
      reason: 'Conflicting appointment attempt'
    })
  });
  assert(doubleBookRes.status === 409, 'Double booking rejected with 409 Conflict status');

  // 9. Doctor Updates Status: PENDING -> CONFIRMED
  const confirmRes = await request(`/appointments/${apptId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'CONFIRMED' })
  });
  assert(confirmRes.status === 200 && confirmRes.data.status === 'CONFIRMED', 'Doctor confirms appointment (PENDING -> CONFIRMED)');

  // 10. Doctor Updates Status: CONFIRMED -> COMPLETED
  const completeRes = await request(`/appointments/${apptId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'COMPLETED' })
  });
  assert(completeRes.status === 200 && completeRes.data.status === 'COMPLETED', 'Doctor completes appointment (CONFIRMED -> COMPLETED)');

  // 11. Invalid Transition Check: COMPLETED -> REJECTED should fail
  const invalidRes = await request(`/appointments/${apptId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'REJECTED' })
  });
  assert(invalidRes.status === 400, 'Invalid status transition rejected with 400 Bad Request');

  // 12. Admin Dashboard Stats
  const adminStats = await request('/admin/dashboard');
  assert(adminStats.status === 200 && adminStats.data.totalPatients >= 2 && adminStats.data.totalDoctors >= 4, 'Admin dashboard statistics calculated accurately');

  // 13. Admin Deactivate & Reactivate Doctor
  const deactivateRes = await request('/admin/doctors/2/status', {
    method: 'PUT',
    body: JSON.stringify({ active: false })
  });
  assert(deactivateRes.status === 200 && deactivateRes.data.active === false, 'Admin deactivates doctor');

  const reactivateRes = await request('/admin/doctors/2/status', {
    method: 'PUT',
    body: JSON.stringify({ active: true })
  });
  assert(reactivateRes.status === 200 && reactivateRes.data.active === true, 'Admin reactivates doctor');

  console.log(`\n========================================`);
  console.log(`Total Tests: ${total} | Passed: ${passed} | Failed: ${total - passed}`);
  console.log(`========================================\n`);

  if (passed === total) {
    console.log('🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
