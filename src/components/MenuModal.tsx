import { useState } from 'react';
import { X, Download } from 'lucide-react';

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MenuModal({ isOpen, onClose }: MenuModalProps) {
    const [activeTab, setActiveTab] = useState<'saves' | 'controls' | 'about'>('controls');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-4 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab('saves')}
                            className={`px-2 py-1 transition-colors ${activeTab === 'saves' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Saves
                        </button>
                        <button
                            onClick={() => setActiveTab('controls')}
                            className={`px-2 py-1 transition-colors ${activeTab === 'controls' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Controls
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`px-2 py-1 transition-colors ${activeTab === 'about' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            About
                        </button>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[300px]">

                    {/* SAVES TAB */}
                    {activeTab === 'saves' && (
                        <div className="text-center text-slate-500 dark:text-slate-400 space-y-4 py-8">
                            <Download className="w-12 h-12 mx-auto opacity-20" />
                            <p>Save management coming soon...</p>
                            <p className="text-xs">Your progress is automatically saved to your browser.</p>
                        </div>
                    )}

                    {/* CONTROLS TAB */}
                    {activeTab === 'controls' && (
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-medium text-slate-900 dark:text-slate-200">Left-click</span>
                                <span className="text-slate-500 dark:text-slate-400">Select item</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-medium text-slate-900 dark:text-slate-200">Right-click</span>
                                <span className="text-slate-500 dark:text-slate-400">Delete item</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-medium text-slate-900 dark:text-slate-200">Double-click</span>
                                <span className="text-slate-500 dark:text-slate-400">Duplicate item</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-medium text-slate-900 dark:text-slate-200">Scroll wheel</span>
                                <span className="text-slate-500 dark:text-slate-400">Zoom</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-medium text-slate-900 dark:text-slate-200">Middle-click / Arrows</span>
                                <span className="text-slate-500 dark:text-slate-400">Pan canvas</span>
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center">
                                <span className="text-2xl">🌍</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Canvas Mindfull</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Infinite Discovery Engine</p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-[260px] mx-auto">
                                An infinite crafting game powered by a deterministic physics engine. Discover all 500+ elements.
                            </p>
                            <div className="pt-4 text-xs text-slate-400">
                                Version 1.0.0 • Physics Simulation
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
