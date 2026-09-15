const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
  const absolutePath = path.resolve(filePath);
  let content = fs.readFileSync(absolutePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
}

replaceFile('src/app/(dashboard)/deals/page.tsx', [
  {
    search: `                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-9 w-full" />
                        </CardFooter>
                      </Card>
                    ))}`,
    replace: `                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-2 w-full">
                              <Skeleton className="h-5 w-3/4 max-w-[200px]" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-md shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 space-y-2.5">
                          <Skeleton className="h-4 w-full" />
                          <div className="space-y-1.5 pt-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                          </div>
                          <Skeleton className="h-3 w-32 mt-4" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 min-h-[44px] w-full rounded-md" />
                        </CardFooter>
                      </Card>
                    ))}`
  }
]);

console.log("Deals Loading Skeleton UI Polish Done.");
