export type PartCategory = 'floor' | 'wall' | 'ceiling' | 'furniture';

export type Part = {
  id: string;
  name: string;
  category: PartCategory;
  color: string;
  roughness: number;
  metalness: number;
  satisfaction_score: number;
  cost_man_yen: number;
};

export const PARTS_CATALOG: Part[] = [
  { id:'floor_concrete',    name:'モルタル仕上げ',    category:'floor', color:'#b0aaa0', roughness:0.9,  metalness:0, satisfaction_score:5.5, cost_man_yen:15 },
  { id:'floor_oak',         name:'オーク無垢材',      category:'floor', color:'#c8a870', roughness:0.7,  metalness:0, satisfaction_score:8.2, cost_man_yen:45 },
  { id:'floor_tile',        name:'テラコッタタイル',  category:'floor', color:'#c87050', roughness:0.6,  metalness:0, satisfaction_score:7.0, cost_man_yen:30 },
  { id:'floor_herringbone', name:'ヘリンボーン',      category:'floor', color:'#a07840', roughness:0.65, metalness:0, satisfaction_score:9.0, cost_man_yen:60 },
  { id:'wall_white',        name:'AEP塗装（白）',    category:'wall',  color:'#f5f2ee', roughness:0.95, metalness:0, satisfaction_score:5.0, cost_man_yen:8  },
  { id:'wall_mortar',       name:'スキン仕上げ',      category:'wall',  color:'#d8d0c4', roughness:0.85, metalness:0, satisfaction_score:7.5, cost_man_yen:22 },
  { id:'wall_brick',        name:'アンティークレンガ',category:'wall',  color:'#a05840', roughness:0.95, metalness:0, satisfaction_score:8.0, cost_man_yen:35 },
  { id:'wall_panel',        name:'木羽目板（縦）',    category:'wall',  color:'#b89060', roughness:0.75, metalness:0, satisfaction_score:8.8, cost_man_yen:40 },
];