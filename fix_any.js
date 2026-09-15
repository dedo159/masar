const fs = require('fs');

let client = fs.readFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', 'utf8');
client = client.replace('catch (error) {', 'catch (error: any) {');
fs.writeFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', client, 'utf8');

let route = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');
route = route.replace('catch (e) {', 'catch (e: any) {');
route = route.replace('catch (error) {', 'catch (error: any) {');
fs.writeFileSync('src/app/api/student/readiness/route.ts', route, 'utf8');