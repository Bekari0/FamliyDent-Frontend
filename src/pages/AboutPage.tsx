import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as styles from './AboutPage.styles';

const VALUES = [
 { title: 'Р‘РµР·Р±РѕР»РµР·РЅРµРЅРЅРѕСЃС‚СЊ', desc: 'РџСЂРёРјРµРЅСЏРµРј РёРЅРЅРѕРІР°С†РёРѕРЅРЅС‹Рµ РјРµС‚РѕРґС‹ Р°РЅРµСЃС‚РµР·РёРё Рё СЃРµРґР°С†РёРё' },
 { title: 'РўРѕС‡РЅРѕСЃС‚СЊ', desc: 'РњРёРєСЂРѕСЃРєРѕРїРёС‡РµСЃРєРёР№ РєРѕРЅС‚СЂРѕР»СЊ РІСЃРµС… СЌС‚Р°РїРѕРІ Р»РµС‡РµРЅРёСЏ РґР»СЏ РґРѕР»РіРѕРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°' },
 { title: 'Р§РµСЃС‚РЅРѕСЃС‚СЊ', desc: 'РџСЂРѕР·СЂР°С‡РЅС‹Рµ РїР»Р°РЅС‹ Р»РµС‡РµРЅРёСЏ Р±РµР· РЅР°РІСЏР·С‹РІР°РЅРёСЏ РЅРµРЅСѓР¶РЅС‹С… СѓСЃР»СѓРі' },
];

export function AboutPage() {
 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.backWrapper}>
 <Link to="/" className={styles.backButton}>
 <ChevronRight className={styles.backIcon} />
 Р’РµСЂРЅСѓС‚СЊСЃСЏ РЅР° РіР»Р°РІРЅСѓСЋ
 </Link>
 </div>

 <div className={styles.mainGrid}>
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 animate={{ opacity: 1, x: 0 }}
 >
 <div className={styles.badge}>РњРёСЃСЃРёСЏ РєР»РёРЅРёРєРё</div>
 <h1 className={styles.title}>
 РЎРѕР·РґР°РµРј СѓР»С‹Р±РєРё, <br />
 <span className={styles.titleAccent}>РєРѕС‚РѕСЂС‹Рј РґРѕРІРµСЂСЏСЋС‚</span>
 </h1>
 <p className={styles.description}>
 FamilyDent вЂ” СЌС‚Рѕ СЃРѕРІСЂРµРјРµРЅРЅС‹Р№ СЃС‚РѕРјР°С‚РѕР»РѕРіРёС‡РµСЃРєРёР№ С†РµРЅС‚СЂ РІ Р”СѓС€Р°РЅР±Рµ, РіРґРµ РјС‹ РѕР±СЉРµРґРёРЅРёР»Рё РїРµСЂРµРґРѕРІС‹Рµ С‚РµС…РЅРѕР»РѕРіРёРё, РѕРїС‹С‚ РІРµРґСѓС‰РёС… РІСЂР°С‡РµР№ Рё РёСЃРєСЂРµРЅРЅСЋСЋ Р·Р°Р±РѕС‚Сѓ Рѕ РєР°Р¶РґРѕРј РїР°С†РёРµРЅС‚Рµ. РќР°С€Р° С†РµР»СЊ вЂ” СЃРґРµР»Р°С‚СЊ РІР°С€Рµ Р»РµС‡РµРЅРёРµ РєРѕРјС„РѕСЂС‚РЅС‹Рј Рё СЌС„С„РµРєС‚РёРІРЅС‹Рј.
 </p>
 <div className={styles.statsGrid}>
 <div>
 <div className={styles.statValue}>12+</div>
 <div className={styles.statLabel}>Р›РµС‚ РѕРїС‹С‚Р°</div>
 </div>
 <div>
 <div className={styles.statValue}>15Рє+</div>
 <div className={styles.statLabel}>РЎС‡Р°СЃС‚Р»РёРІС‹С… РїР°С†РёРµРЅС‚РѕРІ</div>
 </div>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className={styles.imageBox}
 >
 <div className={styles.imageWrapper}>
 <img
 src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
 alt="FamilyDent Clinic"
 className={styles.image}
 />
 </div>
 <div className={styles.infoCard}>
 <div className={styles.iconBox}>
 <Award className={styles.infoIcon} />
 </div>
 <div>
 <div className={styles.infoCardTitle}>РљР»РёРЅРёРєР° в„–1</div>
 <div className={styles.infoCardDescription}>РџРѕ РІРµСЂСЃРёРё РїР°С†РёРµРЅС‚РѕРІ Р”СѓС€Р°РЅР±Рµ</div>
 </div>
 </div>
 </motion.div>
 </div>

 <div className={styles.valuesSection}>
 <div className={styles.valuesInner}>
 <h2 className={styles.valuesTitle}>
 РќР°С€Рё С„СѓРЅРґР°РјРµРЅС‚Р°Р»СЊРЅС‹Рµ <span className={styles.valuesTitleAccent}>РїСЂРёРЅС†РёРїС‹</span>
 </h2>
 <div className={styles.valuesGrid}>
 {VALUES.map((item) => (
 <div key={item.title} className={styles.valueItem}>
 <div className={styles.valueIcon}>
 <CheckCircle2 className={styles.valueIconInner} />
 </div>
 <h4 className={styles.valueTitle}>{item.title}</h4>
 <p className={styles.valueDescription}>{item.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

