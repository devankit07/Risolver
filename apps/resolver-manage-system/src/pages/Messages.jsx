import React, { useState, useEffect } from 'react';
import { Search, Bell, History, SlidersHorizontal, ChevronLeft, ChevronRight, AlertTriangle, X, Bold, Italic, Paperclip, Smile, Send } from 'lucide-react';

export default function Messages() {
  const [activeIncident, setActiveIncident] = useState(null);
  const [panelWidth, setPanelWidth] = useState(450);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setPanelWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`bg-[#f9f9ff] font-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container w-full h-full relative overflow-hidden flex flex-col ${isDragging ? 'select-none' : ''}`}>
      <style>{`
        /* Hide the parent layout's AppTopbar and padding to prevent duplicate headers */
        .flex.min-h-0.min-w-0.flex-1.flex-col > .shrink-0.px-4 {
          display: none !important;
        }
        main.min-h-0.flex-1 {
          padding: 0 !important;
        }
      `}</style>
      {/* TopAppBar */}
      <header className="h-16 shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 w-full z-30">
        <div className="flex items-center gap-8">
          <h2 className="text-base font-semibold text-gray-900">Messages</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-80 focus:ring-2 focus:ring-primary outline-none" placeholder="Search threads..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all flex items-center justify-center">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden ml-2 border border-outline-variant">
            <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmzHDJwxcgo49OYkINmlK-_wLsw2M-IYee6zxS8r-e3Z_uPugjDWv_mHur-ptWDAvh6XgtENuc1LtCAuI5fzsrHgvPDQFGp_aa1suzN-j_WyXg4ztb0DFuWBxjh0IK8Fd1J_TP5ljctMSEgHYhdIrCO8J0NlUY336L0LXuoSEqEKV1A3cnmZUbgg5hsUnuPpEELpc9x-jA9EoHMAB0lBecLwbnfiWqkWuPATxeqzvijPbb1-KlLkRUNdG8hEDuVKo0t9_bpgPux9lH"/>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-auto">
        {/* Stats Summary Bar (Information Density) */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white border border-outline-variant rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Active Threads</p>
              <p className="text-headline-md font-bold">24</p>
            </div>
            <span className="material-symbols-outlined text-primary-container">forum</span>
          </div>
          <div className="flex-1 bg-white border border-outline-variant rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Urgent Alert</p>
              <p className="text-headline-md font-bold text-error">03</p>
            </div>
            <span className="material-symbols-outlined text-error">error</span>
          </div>
          <div className="flex-1 bg-white border border-outline-variant rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Avg Response</p>
              <p className="text-headline-md font-bold">1.2m</p>
            </div>
            <span className="material-symbols-outlined text-secondary">timer</span>
          </div>
          <div className="flex-1 bg-white border border-outline-variant rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Resolution Rate</p>
              <p className="text-headline-md font-bold">98%</p>
            </div>
            <span className="material-symbols-outlined text-tertiary">check_circle</span>
          </div>
        </div>

        {/* Dense List View */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-3 text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Incident Name</th>
                  <th className="px-6 py-3 text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {/* Row 1 */}
                <tr 
                  className={`hover:bg-surface-container-lowest transition-colors cursor-pointer group ${activeIncident === 'INC-402' ? 'bg-surface-container-low' : ''}`}
                  onClick={() => setActiveIncident('INC-402')}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                      <div>
                        <p className="font-semibold text-gray-900">INC-402: API Gateway Latency Spike</p>
                        <p className="text-xs text-gray-500">Last message: "Rebooting nodes in us-east-1..."</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-on-error-container border border-error/20">Critical</span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">14m 22s</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <img alt="Assignee" className="h-6 w-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9JZI2vkf-k4sIkX0hPQmm95tKGCiYh5zWmcSXdwsttZfa7kEw9bls9KWqu4der9GG-rsW4mxA_M_WyVJRx-1-2eiMwKJKZZEhsROb-YbZZ3p5y0b9A-j3PQmlCirrXb1G7CasaUHOtFN35QSFRwThETat6iC2rP9IpuDo7ddGwYAbZ4L6pKP5npR2UHLe1w0rKNqW85e6sfaJt7VXTvA6t0ysS8J7kaIis0qbjYQ-HMZlJmFTFaXfZg2c5BQBRfFmnQvFzGNCePva" />
                      <span className="text-sm font-medium text-gray-700">Alex Chen</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">Open Thread</button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr 
                  className={`hover:bg-surface-container-lowest transition-colors cursor-pointer group ${activeIncident === 'INC-398' ? 'bg-surface-container-low' : ''}`}
                  onClick={() => setActiveIncident('INC-398')}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                      <div>
                        <p className="font-semibold text-gray-900">INC-398: User Authentication Timeout</p>
                        <p className="text-xs text-gray-500">Last message: "Trace logs confirm database lock..."</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/20">Warning</span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">2h 45m</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <img alt="Assignee" className="h-6 w-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb7L-Vg8-ws8KhgMtesCrTOvDxmDesen7CvYu1PRUyhmaIxYmYL5fExFkawM4qTF5xaL5w_PWJiALGrJ7sXcPD8djGoacNaNi9BErdhPN_dvCWVFSc6VDhQMnvP_cDO12SQfOI4Ucl_IP5OoyuOsTUa9gc4Z9mqupUi1-n0lHaH2nnbySQyzA3t_qIAVdjiMOUa0kP2VvWxgx0m93kJdkSoc3TBsmkUbCmQ181ZIxO7LjbRvnwOfV9r-CoFHHHU9RdVgFnNe4wB8lx" />
                      <span className="text-sm font-medium text-gray-700">Sarah Jenkins</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">Open Thread</button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr 
                  className={`hover:bg-surface-container-lowest transition-colors cursor-pointer group ${activeIncident === 'INC-397' ? 'bg-surface-container-low' : ''}`}
                  onClick={() => setActiveIncident('INC-397')}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <div>
                        <p className="font-semibold text-gray-900">INC-397: Dashboard UI Regression</p>
                        <p className="text-xs text-gray-500">Last message: "Fixed in staging branch."</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container border border-secondary/20">Minor</span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">1d 4h</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <img alt="Assignee" className="h-6 w-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-iKZ5JVnyP5kJ6jTk8UVlzV74ShfRLizvX5kNBrgYxC3Y3IacZQ7d154CWfEmcTR4e2IonZ8LjEepiC9fCmouJ1DZWn6qDu8ZenwIT4yaVVjBBT9v8b4pzyvN5asT3Nm-4LLsDp-C_dbWNjsEhy2tQdPTMxX5I5J_QQ4MayIdOwCpQLh0Rq7NnkdXrKKrnHlhetoTlXczVnmtzOC2J2NNfYASaeTSZNTTOtThkVNn1_XcUciLooM8D0ku8RqaA8H58_KKl3Wb8c4H" />
                      <span className="text-sm font-medium text-gray-700">David Kim</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">Open Thread</button>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr 
                  className={`hover:bg-surface-container-lowest transition-colors cursor-pointer group ${activeIncident === 'INC-405' ? 'bg-surface-container-low' : ''}`}
                  onClick={() => setActiveIncident('INC-405')}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      <div>
                        <p className="font-semibold text-gray-900">INC-405: Primary Database Failover</p>
                        <p className="text-xs text-gray-500">Last message: "Switching to replica in eu-west-2..."</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-on-error-container border border-error/20">Critical</span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">2m 10s</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <img alt="Assignee" className="h-6 w-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhopOFMOrS8RM9xKQuKIsnU-f2viYoUuQmJUVTMa6ha8-8NsQdvkw4lWR6mnwD-uBHOgE_KbXB269NXW58a_d6OkLnL_wUDBrInbxMnz8CCw60l_3ICIxcAe54kFc5nDNg_EBRI5d4HH9W1ECmcrv-4RoZt1KOHM2iydupilFi0JmW4a1JWxvgTbTEX0vf5trxLANgwziQ6tLcB3o9JTm3oh1QNEM0j4FkJLFOEx3HVfRS_Be_1l5k9XqNVkW9_zQCBq814eyYyJsp" />
                      <span className="text-sm font-medium text-gray-700">Emily Davis</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">Open Thread</button>
                  </td>
                </tr>
                {/* Additional Rows */}
                <tr 
                  className={`hover:bg-surface-container-lowest transition-colors cursor-pointer group ${activeIncident === 'INC-394' ? 'bg-surface-container-low' : ''}`}
                  onClick={() => setActiveIncident('INC-394')}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                      <div>
                        <p className="font-semibold text-gray-900">INC-394: S3 Bucket Permissions Error</p>
                        <p className="text-xs text-gray-500">Last message: "Reviewing IAM policies."</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/20">Warning</span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">5h 12m</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <img alt="Assignee" className="h-6 w-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkcuraDgbWh6iIMrxTquHs4NY40HGQ0zxP725qW4w5tMTJwV-R4ohU6MvU9g4Zw594NHG1KuxRF6a9tmzhK7BvvHxMcOBb7A7VZXqJmQTKxGAWNkFYzE2BOICYP0a609ZfKldkgEb85KrrcgN4bzzOCB_3GTmTC18aQaxs153Z1g_yi4mK_tMmdVRY9CXrxErjVOHzfTeMQGZLlfDUqKDq_6FzxB6g_213TkW5GSLOAG-fCLrF2loRHIGo7B1XoZeFiXsIwqDairDc" />
                      <span className="text-sm font-medium text-gray-700">Michael Lee</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">Open Thread</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-surface-container-low px-6 py-3 flex items-center justify-between border-t border-outline-variant">
            <p className="text-xs text-on-surface-variant font-medium">Showing 5 of 24 active incidents</p>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-gray-200 text-on-surface-variant transition-colors disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-200 text-on-surface-variant transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Slide-over (Simulated interaction state) */}
      <div 
        className={`fixed inset-y-0 right-0 bg-white shadow-2xl border-l border-outline-variant z-40 flex flex-col transform ${activeIncident ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: panelWidth, transition: isDragging ? 'none' : 'transform 300ms ease-in-out' }}
      >
        {/* Resize Handle */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 z-50 transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
        />
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{activeIncident || 'INC-402'}: API Gateway...</h3>
              <p className="text-xs text-error font-medium">CRITICAL • 14 participants</p>
            </div>
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            onClick={() => setActiveIncident(null)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container-low/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="text-center">
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-widest">Incident Started 14m ago</span>
          </div>
          
          <div className="flex items-start gap-3">
            <img alt="User" className="h-8 w-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgEUIiN7FWKZut1zBRz_UiE86xHxhb8q_bbjXaOXm-j1lZmFKqJLzJszYx0uVIZo4ooFZfSaUtYlhk3F1ep0aTLLBbwZ2in1X_YCn22okamJa1Tv1zZzK3TWDEYMf8Eztt5dRA-L9AZ7CCJovlnKN71ZkFt-Pn0blvujXJGqYu2fHsJnGUDFFI6VEbGBy-zDWVrIZwzpG0SSzNqBcsrbQO9cbhtAyZQ0jPSi9ArPC1B9sWUrvJsYslOm0K1PPxUxklue8nLv-NSKnX" />
            <div>
              <div className="bg-white border border-outline-variant p-3 rounded-tr-xl rounded-b-xl max-w-[320px]">
                <p className="text-sm">Seeing 504 errors on all gateway endpoints. Scaling groups are not triggering.</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Sarah Chen • 14:02</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 flex-row-reverse">
            <img alt="User" className="h-8 w-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdPzbuUPbwr6AxxwMobmDYpHvLtaoQ7qlQCQu6jr5cHtimvs4mwql-QcXEYfwZdLVqH2N4ghttkfinKP5T34dvMTowNzB5akD0GLOrWfdH6mMEqOBrlXfo1iDIn0piXhdVgvGgKjpScmitGnibZ6VGLcIMsLDBdZvrGxAhF7e4mQCsUCwKCp4K5YEU31ojrydKB0mGZKd7n0cQjfvkppfU9f4rJtExyuO7SEeuKQCIIZ5GRDb94wL9Db0Dh02dmd_hnR786ueYrjkY" />
            <div className="flex flex-col items-end">
              <div className="bg-primary-container text-white p-3 rounded-tl-xl rounded-b-xl max-w-[320px]">
                <p className="text-sm">Verified. I'm manually triggering a rolling restart for the gateway cluster now. Watch the latency metrics.</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-right">You • 14:03</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <img alt="User" className="h-8 w-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX2AiFhRtXij6OAIbakWHnIChoDzyMxYW4qbSMyGa2Pf5g9nhZAr4tpKn3v8pDmRh0ekrfWZrfbeKB6gHQMAAnSn95ZxovXYKXHK9X3Aa73CoMFlRZPoNQkz5drec8-Dzz6oSOUuLDagDDlRJQmkAhcdZ8dIU09ahWtoWWewDBz_RiJcoDAZJ8mQhD_wi1xZbN4lLx14Y3MV-NDE2Uas4sUhUayWr6RIWEDjBETRES6QF5GM9Knj7OZOSfdC3wWQV419-Jl_60SNoq" />
            <div>
              <div className="bg-white border border-outline-variant p-3 rounded-tr-xl rounded-b-xl max-w-[320px]">
                <p className="text-sm italic text-gray-500 underline">Attached: gateway_logs_1402.json</p>
                <p className="text-sm mt-2">Logs show a flood of requests from IP 185.x.x.x - possible DDoS?</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Marcus Wright • 14:05</p>
            </div>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-outline-variant bg-white">
          <div className="flex items-center gap-2 mb-2">
            <button className="p-1 text-gray-400 hover:text-primary transition-colors"><Bold className="w-5 h-5" /></button>
            <button className="p-1 text-gray-400 hover:text-primary transition-colors"><Italic className="w-5 h-5" /></button>
            <button className="p-1 text-gray-400 hover:text-primary transition-colors"><Paperclip className="w-5 h-5" /></button>
            <button className="p-1 text-gray-400 hover:text-primary transition-colors"><Smile className="w-5 h-5" /></button>
          </div>
          <div className="relative">
            <textarea className="w-full bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary p-3 resize-none" placeholder="Send a message to the incident team..." rows={2}></textarea>
            <button className="absolute bottom-2 right-2 p-1.5 bg-primary-container text-white rounded-lg hover:bg-primary transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
