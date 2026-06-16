import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlaskConical, Beaker, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { laboratoryService, type LabTestRequest, type LabTestRequestItem } from '@/services/api/laboratoryService';
import { LabResultEntryForm } from './components/LabResultEntryForm';

export function LabWorklistPage() {
  const [requests, setRequests] = useState<LabTestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LabTestRequestItem | null>(null);

  useEffect(() => {
    loadWorklist();
  }, []);

  const loadWorklist = async () => {
    setLoading(true);
    try {
      const data = await laboratoryService.getPendingRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load worklist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      pageTitle="Laboratory Worklist"
      pageAction={
        <Button variant="outline" size="sm" onClick={loadWorklist}>
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading worklist...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 bg-white border border-dashed border-zinc-200 rounded-xl text-center">
            <FlaskConical className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-900">Worklist Empty</h3>
            <p className="text-zinc-500">There are no pending laboratory requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Request #</span>
                    <p className="text-sm font-bold text-zinc-900">{req.requestNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Patient</span>
                    <p className="text-sm font-bold text-zinc-900">{req.patientName}</p>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50/50 text-zinc-500 font-medium">
                      <tr>
                        <th className="px-4 py-2 border-b border-zinc-100">Test Name</th>
                        <th className="px-4 py-2 border-b border-zinc-100">Status</th>
                        <th className="px-4 py-2 border-b border-zinc-100">Result</th>
                        <th className="px-4 py-2 border-b border-zinc-100 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.items.map(item => (
                        <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-zinc-900">{item.testName}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.resultValue ? (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{item.resultValue}</span>
                                    <span className="text-zinc-400 text-xs">{item.unit}</span>
                                    {item.resultFlag !== 'NORMAL' && (
                                        <span className="text-red-500 font-bold text-[10px]">{item.resultFlag}</span>
                                    )}
                                </div>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.status !== 'COMPLETED' && (
                                <Button size="sm" variant="ghost" onClick={() => setSelectedItem(item)} className="h-7 text-xs font-bold text-zinc-900 hover:bg-zinc-100">
                                    Enter Result
                                </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result Entry Modal (Simple Overlay) */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
               <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    <Beaker className="w-4 h-4" /> {selectedItem.testName}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                    <CheckCircle className="w-4 h-4" />
                  </Button>
               </div>
               <div className="p-6">
                  <LabResultEntryForm
                    item={selectedItem}
                    onSuccess={() => { setSelectedItem(null); loadWorklist(); }}
                    onCancel={() => setSelectedItem(null)}
                  />
               </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
