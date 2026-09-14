const fs = require('fs');
const path = require('path');

// 1. types.ts
const typesPath = path.join('src', 'lib', 'resume', 'types.ts');
let typesContent = fs.readFileSync(typesPath, 'utf8');

const designType = \
export interface ResumeDesign {
  themeColor: string; // "blue", "green", "red", "purple", "black"
  fontFamily: string; // "sans", "serif", "mono"
}
\;

if (!typesContent.includes('ResumeDesign')) {
    typesContent = typesContent.replace('export interface ResumeStateData {', designType + '\nexport interface ResumeStateData {\n  design: ResumeDesign;');
    typesContent = typesContent.replace('export const initialResumeState: ResumeStateData = {', 'export const initialResumeState: ResumeStateData = {\n  design: { themeColor: "blue", fontFamily: "sans" },');
    
    const designSchema = \
export const updateDesignSchema = z.object({
  themeColor: z.enum(["blue", "green", "red", "purple", "black"]).describe("The primary accent color for the resume."),
  fontFamily: z.enum(["sans", "serif", "mono"]).describe("The typography style.")
});
\;
    typesContent += designSchema;
    fs.writeFileSync(typesPath, typesContent);
}

// 2. store.ts
const storePath = path.join('src', 'lib', 'resume', 'store.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');

if (!storeContent.includes('updateDesign:')) {
    storeContent = storeContent.replace('updateCertifications:', 'updateDesign: (design: Partial<ResumeStateData["design"]>) => void;\n  updateCertifications:');
    
    const updateDesignFunc = \
  updateDesign: (design) => set((state) => ({
    data: { ...state.data, design: { ...state.data.design, ...design } },
    activeField: 'design'
  })),
  updateCertifications:\;
    storeContent = storeContent.replace('updateCertifications: (certifications)', updateDesignFunc + ' (certifications)');
    fs.writeFileSync(storePath, storeContent);
}

// 3. route.ts
const routePath = path.join('src', 'app', 'api', 'resume-ai', 'route.ts');
let routeContent = fs.readFileSync(routePath, 'utf8');

if (!routeContent.includes('updateDesignSchema')) {
    routeContent = routeContent.replace('updateCertificationsSchema', 'updateCertificationsSchema,\\n  updateDesignSchema');
    routeContent = routeContent.replace('update_certifications: tool({', \update_design: tool({
        description: "Update the resume visual design (color and font).",
        parameters: updateDesignSchema,
      }),
      update_certifications: tool({\);
      
    // Update system prompt for Arabic
    routeContent = routeContent.replace(/const systemPrompt = \\\[\\s\\S]*?\\\;/, \const systemPrompt = \\\\\\أنت خبير توظيف تقني ومدرب مهني (Senior Technical Recruiter & Elite Career Coach).
هدفك هو مساعدة الطالب على بناء سيرة ذاتية احترافية، متوافقة مع أنظمة التوظيف (ATS) وقوية جداً.
**يجب أن تتحدث مع المستخدم باللغة العربية دائماً وبأسلوب مشجع واحترافي.**
لديك القدرة على تحديث بيانات السيرة الذاتية لحظياً بالإضافة إلى القدرة على تغيير تصميم السيرة الذاتية (اللون والخط).

### قواعد صارمة:
1. التحدث باللغة العربية فقط في ردودك، ولكن يمكنك كتابة المصطلحات التقنية بالإنجليزية.
2. استخدم صيغة Google (X-Y-Z) لكتابة الإنجازات: "أنجزت [X] كما يقاس بـ [Y] من خلال فعل [Z]".
3. لا تستخدم الكلمات الإنشائية الضعيفة، وركز على الأرقام والنتائج.
4. اطلب من المستخدم أرقاماً (مثال: تقليل وقت التحميل 20٪).
5. عندما يطلب المستخدم تعديلاً (حتى لو كان تغيير لون أو خط السيرة)، قم **دائماً** باستدعاء الأداة (Tool) المناسبة لتنفيذ التعديل على الفور.
6. اجعل ردودك قصيرة، مركزة، ومحفزة.
\\\\\\;\);
    fs.writeFileSync(routePath, routeContent);
}

// 4. ResumeChat.tsx
const chatPath = path.join('src', 'components', 'resume', 'ResumeChat.tsx');
let chatContent = fs.readFileSync(chatPath, 'utf8');

if (!chatContent.includes('case \\'update_design\\':')) {
    chatContent = chatContent.replace('case \\'update_certifications\\':', \case 'update_design':
                store.updateDesign(args);
                break;
              case 'update_certifications':\);
    chatContent = chatContent.replace("Hello! I'm your AI Career Coach. Let's craft an outstanding ATS-friendly resume. I can update your summary, refine your project bullets using the X-Y-Z formula, or organize your skills. What would you like to improve first?", "مرحباً! أنا مدربك المهني الذكي. لنقم بصياغة سيرة ذاتية احترافية معاً. يمكنني مساعدتك في تحسين الوصف، تقوية الإنجازات، وحتى تغيير ألوان وتصميم السيرة الذاتية. بماذا نبدأ؟");
    fs.writeFileSync(chatPath, chatContent);
}

