import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	EventEmitter,
	Output,
	Input
} from "@angular/core";
import { Router } from "@angular/router";
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormArray,
	AbstractControl
} from "@angular/forms";
import { finalize, tap } from "rxjs/operators";
import { environment } from "@env/environment";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { MitigationActionsService } from "@app/mitigation-actions/mitigation-actions.service";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { Observable } from "rxjs/Observable";
import {
	MitigationActionNewFormData,
	InitiativeType
} from "@app/mitigation-actions/mitigation-action-new-form-data";
import { MitigationAction } from "../mitigation-action";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";
import { DatePipe } from "@angular/common";

const log = new Logger("MitigationAction");

@Component({
	selector: "app-initiative-form",
	templateUrl: "./initiative-form.component.html",
	styleUrls: ["./initiative-form.component.scss"]
})
export class InitiativeFormComponent implements OnInit {
	version: string = environment.version;
	error: string;
	form: FormGroup;
	isLoading = false;
	isLinear = true;
	wasSubmittedSuccessfully = false;
	initiativeTypes: InitiativeType[];
	displayFinancialSource: boolean;

	mitigationAction: MitigationAction;
	initiativeGoalList: string[] = [];

	@Input() newFormData: Observable<MitigationActionNewFormData>;
	// @Input() action: string;
	@Input() processedNewFormData: MitigationActionNewFormData;
	@Input() isUpdating: boolean;
	@ViewChild("errorComponent") errorComponent: ErrorReportingComponent;

	ndcList = [
		{
			name: "1. Movilidad y transporte",
			options: [
				{
					name:
						"Durante el periodo de cumplimiento de esta NDC entrará en operación el Tren Eléctrico de Pasajeros en el Gran Área Metropolitana, impulsado por energía eléctrica renovable",
					code: "1.1"
				},
				{
					name:
						"En el 2021 se renovarán las concesiones de autobuses públicos con criterios de descarbonización, incluyendo la sectorización, el pago electrónico y la integración multimodal de medios de transporte público y activo.",
					code: "1.2"
				},
				{
					name:
						"Durante el periodo de cumplimiento de esta NDC, el Tren Eléctrico Limonense de Carga (TELCA) estará en operación para el año 2022.",
					code: "1.3"
				},
				{
					name:
						"En el año 2030, al menos el 8% de la flota de transporte público del país será cero emisiones.",
					code: "1.4"
				},
				{
					name:
						"En el año 2030, se habrá ampliado y mejorado la infraestructura para aumentar en al menos un 5% los viajes en movilidad no motorizada (incluyendo movilidad peatonal y en bicicleta)con respecto a la trayectoria actual.",
					code: "1.5"
				},
				{
					name:
						"Para el año 2025, el país habrá adoptado estándares para migrar hacia una flota de motocicletas cero emisiones y la estabilización del crecimiento de flota de motocicletas",
					code: "1.6"
				},
				{
					name:
						"En el año 2030, al menos el 8% de la flota de vehículos ligeros —privados e institucionales— será eléctrica.",
					code: "1.7"
				},
				{
					name:
						"En el año 2025 se habrá iniciado el establecimiento de modelos de logística sostenible en los principales puertos, zonas urbanas y centros de consolidaciónlogística del país, en consonancia con el Plan Estratégico Nacional Costa Rica 2050.",
					code: "1.8"
				},
				{
					name:
						"Al año 2030, el país habrá reducido significativamente su brecha digital y tecnológica, con particular énfasis en poblaciones social y económicamente vulnerables, mediante un modelo solidario, contemplando aspectos como conectividad a Internet, equipamiento y apropiación digital. Esto será un habilitador para cerrar las brechas sociales y económicas mediante prácticas digitales como teletrabajo, comercio electrónico y turismo virtual (que reducen la necesidad de desplazamientos), aumentando la eficiencia y el dinamismo económico nacional.",
					code: "1.9"
				}
			]
		},
		{
			name: "2. Desarrollo y ordenamiento territorial",
			options: [
				{
					name:
						"Al 2030, se habrán incorporado criterios de adaptación en distintos instrumentos de planificación territorial, entre estos los planes regionales de desarrollo, los planes reguladores cantonales y costeros, los planes maestros y los planes generales de manejo de áreas silvestres protegidas y de corredores biológicos, entre otros, con apego a las normas establecidas y las competencias institucionales",
					code: "2.1"
				},
				{
					name:
						"Al 2030, se habrán incorporado criterios de desarrollo orientado al transporte en distintos instrumentos de planificación territorial, entre estos el Plan Nacional de Desarrollo Urbano, los planes regionales de desarrollo y los planes reguladores cantonales y costeros; estos se implementan de manera que articulen los modos de movilidad sostenible con el modelo de ciudades compactas.",
					code: "2.2"
				}
			]
		},
		{
			name: "3. Energía",
			options: [
				{
					name:
						"La meta aspiracional de esta contribución es alcanzar y mantener una generación eléctrica 100% renovable al 2030. El país mantendrá la capacidad térmica necesaria para asegurar la confiabilidad del sistema, procurando eliminarla en cuanto existan otras alternativas técnica y económicamente viables",
					code: "3.1"
				},
				{
					name:
						"Costa Rica se compromete a desarrollar, durante el período de implementación de esta contribución, una planificación integrada intersectorial del proceso de electrificación de la demanda energética, que incorporará las necesidades de los diversos sectores y la diversidad de fuentes renovables de energía disponibles en las diferentes regiones del país",
					code: "3.2"
				},
				{
					name:
						"Para el año 2030 Costa Rica habrá desarrollado y/o actualizado los estándares y regulaciones de eficiencia energética de las tecnologías de uso final (incluyendo, pero no limitada a, equipos de refrigeración y aire acondicionado, calderas, bombas de calor, vehículos, maquinaria y otros equipos de alto consumo energético) para asegurar su consistencia con la trayectoria de descarbonización del país para ser emisiones netas cero al 2050.",
					code: "3.3"
				},
				{
					name:
						"Para el año 2030, las medidas de sustitución tecnológica y de eficiencia energética en los sectores de transporte de pasajeros, de carga e industrial reducirán las emisiones de carbono negro un 20% con respecto a las emisiones del 2018.",
					code: "3.4"
				},
				{
					name:
						"Para el año 2022 Costa Rica habrá desarrollado una estrategia para el desarrollo y promoción del hidrógeno verde en el país.",
					code: "3.5"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, Costa Rica impulsará que se eleve a rango de ley la moratoria de exploración y explotación de hidrocarburos en el territorio nacional.",
					code: "3.6"
				}
			]
		},
		{
			name: "4. Infraestructura y construcción",
			options: [
				{
					name:
						"El país incrementará el uso en edificaciones de madera, bambú y otros materiales locales, incluyendo aquellos de plantaciones de bosques manejados sosteniblemente, hasta aumentar un mínimo de 10% en 2025 sobre la línea base del 2018. En este esfuerzo favorecerá el conocimiento y los oficios tradicionales. sobre estos materiales a través de su transferencia generacional, reconocimiento y diálogo con saberes afines.",
					code: "4.1"
				},
				{
					name:
						"En el año 2030, el 100% de nuevas edificaciones se diseñarán y construirán adoptando sistemas y tecnologías de bajas emisiones y resiliencia bajo parámetros bioclimáticos.",
					code: "4.2"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, el país incorporará criterios de adaptación al cambio climático en normas y lineamientos para la inversión pública, de manera que se asegure su robustez ante impactos climáticos.",
					code: "4.3"
				},
				{
					name:
						"Al 2030, se habrán desarrollado aplicaciones de lineamientos con criterios de adaptación, esfuerzos de articulación institucional y mejoras en la capacidad de respuesta, entre otros, que permitan garantizar la protección de la infraestructura y la continuidad de los servicios públicos vitales (salud, educación, agua y saneamiento, energía, transporte) ante eventos hidrometeorológicos extremos.",
					code: "4.4"
				}
			]
		},
		{
			name: "5. Industria, comercio y servicios",
			options: [
				{
					name:
						"En el año 2030, el área temática de industria, comercio y servicios contará con modelos innovadores productivos de “cuna a cuna” o con un enfoque de economía circular en las principales cadenas productivas de la agro-industria, servicios, construcción y economía creativa y cultural, entre otros.",
					code: "5.1"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, Costa Rica creará y habrá comenzado la implementación de objetivos y metas basados en ciencia y alineados a las Contribuciones Nacionalmente Determinadas y al Plan Nacional de Descarbonización para las actividades productivas de los sectores de industria, comercio y servicios que generan mayor impacto en emisiones de gases de efecto invernadero.",
					code: "5.2"
				},
				{
					name:
						"Al 2030, se reportarán las acciones y resultados concretos en mitigación y adaptación al cambio climático de empresas y cadenas de valor de los productos que más impacto generan en emisiones de gases de efecto invernadero, por medio del Programa País de Carbono Neutralidad y el Sistema Nacional de Métrica de Cambio Climático.",
					code: "5.3"
				},
				{
					name:
						"Costa Rica confirma los compromisos establecidos en la Enmienda de Kigali del Protocolo de Montreal para reducir progresivamente los hidrofluorocarbonos (HFC) y promover los refrigerantes de bajo poder de calentamiento global.",
					code: "5.4"
				},
				{
					name:
						"Al 2030, se habrán generado las condiciones necesarias para promover la innovación, inversión, eco competitividad y resiliencia de la economía ante los efectos adversos producidos por el cambio climático.",
					code: "5.5"
				}
			]
		},
		{
			name: "6. Gestión integrada de residuos",
			options: [
				{
					name:
						"En el año 2025, al menos 10 municipalidades implementan el Plan Nacional de Compostaje.",
					code: "6.1"
				},
				{
					name:
						"Al 2030, se alcanzará al menos el 50% de cobertura de alcantarillado sanitario en las áreas de alta densidad poblacional, incorporando criterios de resiliencia al cambio climático.",
					code: "6.2"
				},
				{
					name:
						"En el año 2030, al menos el 50% de las aguas residuales en las áreas de alta densidad poblacional recibirán tratamiento.",
					code: "6.3"
				},
				{
					name:
						"En los primeros dos años del período de implementación de esta NDC, Costa Rica lanzará su instrumento de política pública para la promoción de la economía circular.",
					code: "6.4"
				},
				{
					name:
						"Durante los primeros dos años de implementación de esta NDC, Costa Rica habrá publicado e iniciado implementación de sus instrumentos de política pública, como el Plan de Acción para la Gestión Integral de Residuos Sólidos 2021-2026 y el Plan Nacional de Compostaje 2020- 2050, articulando los esfuerzos de reducción de emisiones, con un enfoque de transformación al hacia la economía circular y la bioeconomía.",
					code: "6.5"
				}
			]
		},
		{
			name: "7. Agropecuario",
			options: [
				{
					name:
						"En el año 2030, las cadenas de valor de café, ganadería, caña de azúcar, arroz y musáceas aplicarán sistemas productivos bajos en emisiones de GEI y que incorporan medidas de adaptación y resiliencia tanto a nivel de finca como a nivel de etapa de procesamiento.",
					code: "7.1"
				},
				{
					name:
						"En el año 2025, el país impulsará un sistema de economía circular de las fincas agropecuarios considerando integralmente el proceso de biodigestión y la recarbonización del suelo a través del uso de tecnologías para aumentar los niveles de carbono orgánico en suelo (COS), entre otros.",
					code: "7.2"
				},
				{
					name:
						"En el año 2030, el 70% del hato ganadero y 60% del área dedicada a la ganadería implementarán sistemas productivos bajos en emisiones y que incorporan medidas de adaptación y resiliencia.",
					code: "7.3"
				},
				{
					name:
						"Al 2026, se habrá desarrollado un estudio sobre impactos derivados del cambio climático en sistemas productivos agropecuarios y pesqueros, incluyendo afectaciones en sanidad agropecuaria, y cuyos resultados son compartidos de manera apropiada a las realidades y cosmovisiones de las distintas comunidades",
					code: "7.4"
				},
				{
					name:
						"Al 2024, el sector agropecuario contará con su propio plan sectorial de adaptación al cambio climático en implementación.",
					code: "7.5"
				},
				{
					name:
						"Al 2030, se mantendrá una reducción del área total de pastos a una tasa anual del 1% y un aumento del área de pastos con buen manejo a una tasa de 1 a 2% anual sobre la tendencia en la línea base.",
					code: "7.6"
				},
				{
					name:
						"Al 2030, se habrán incorporado prácticas adaptativas y resilientes en sistemas de producción agropecuaria, mediante lineamientos técnicos de resiliencia, certificación y capacitación de manera apropiada a las realidades y cosmovisiones de las distintas comunidades.",
					code: "7.7"
				},
				{
					name:
						"Al 2022 se habrán desarrollado las “Guías Alimentarias Adaptadas” en dos territorios del país con mapas e información que promueva el consumo de productos agrícolas y alimenticios autóctonos y tradicionales de temporada, resaltando su valor nutricional, su aporte a la protección del patrimonio cultural, a la reducción de emisiones y a la seguridad alimentaria",
					code: "7.8"
				}
			]
		},
		{
			name: "8. Bosques y biodiversidad terrestre",
			options: [
				{
					name:
						"Durante el período de implementación de esta contribución, Costa Rica se compromete a potenciar las soluciones basadas en la naturaleza como un pilar central de su acción climática y a incluirlas en sus políticas públicas relacionadas con el cambio climático",
					code: "8.1"
				},
				{
					name:
						"Al año 2030, Costa Rica habrá gestionado acciones, incluyendo el fortalecimiento del sistema cultural indígena de conservación, que le permitan mantener o aumentar la capacidad de captura y/o reducción de emisiones provenientes de los ecosistemas terrestres como los ecosistemas forestales, agroforestales y las turberas, entre otros",
					code: "8.2"
				},
				{
					name:
						"Al año 2030, Costa Rica habrá mantenido y mejorado el programa de Pago por Servicios Ecosistémicos incluyendo otros servicios y ecosistemas no cubiertos hasta ahora incluyendo de manera prioritaria los suelos, turberas y demás ecosistemas con alto potencial de secuestro de carbono, identificando y aumentando las fuentes de financiamiento.",
					code: "8.3"
				},
				{
					name:
						"En el año 2030, el país aumentará y mantendrá su cobertura boscosa al 60%, al tiempo que este tipo de cobertura no compite con el sector agropecuario.",
					code: "8.4"
				},
				{
					name:
						"En el año 2030, el país mantendrá una tasa de deforestación cero en bosque maduro.",
					code: "8.5"
				},
				{
					name:
						"Al 2030, se habrá fomentado la adaptación basada en ecosistemas dentro y fuera del Patrimonio Natural del Estado por medio de la conservación de biodiversidad en corredores biológicos, reservas privadas, territorios indígenas, fincas agropecuarias, y de la gestión integral de patrimonio natural y cultural, entre otros",
					code: "8.6"
				},
				{
					name:
						"Al 2030, se incrementará en 69,500 hectáreas la aplicación de sistemas silvopastoriles y agroforestales completos.",
					code: "8.7"
				},
				{
					name:
						"Al 2030, se habrán intervenido 1,000,000 hectáreas de cobertura boscosa, incluyendo bosque de crecimiento secundario, para evitar degradación de la tierra y favorecer la biodiversidad.",
					code: "8.8"
				},
				{
					name:
						"Al 2030, Costa Rica ejecuta los Planes Ambientales Forestales Territoriales estarán en ejecución, de manera conjunta con los territorios indígenas, como instrumento de implementación de las medidas establecidas en la Estrategia Nacional REDD+; estos planes serán construidos mediante el proceso de consulta conforme al marco establecido para tal fin en la legislación nacional e internacional.",
					code: "8.9"
				}
			]
		},
		{
			name: "9. Océano y recurso hídrico",
			options: [
				{
					name:
						"Al 2022, el 30% de nuestro océano se encontrará bajo algún esquema oficial de protección.",
					code: "9.1"
				},
				{
					name:
						"Al 2030, se habrá fomentado la seguridad y sostenibilidad hídrica ante el cambio climático, así como el adecuado e integrado manejo de cuencas hidrográficas, por medio de la protección y el monitoreo de fuentes considerando tanto aguas superficiales como subterráneas.",
					code: "9.2"
				},
				{
					name:
						"Como ambición general de su meta de carbono azul, Costa Rica seguirá liderando en la conservación, el uso responsable y la restauración de humedales costeros a través de la profundización del conocimiento científico de los servicios ecosistémicos que estos hábitats proveen y tomará pasos para proteger mejor y restaurar estos espacios en el futuro.",
					code: "9.3"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, Costa Rica se compromete a una protección y conservación mejorada de los ecosistemas de carbono azul existentes.",
					code: "9.4"
				},
				{
					name:
						"El país protegerá y conservará el 100% de los humedales costeros incluidos y reportados en el Inventario Nacional de Humedales (en el período 2016-2018) para el año 2025 y aumentará el área de humedales estuarinos registrados en al menos 10% para el año 2030, para así proteger y conservar estos ecosistemas.",
					code: "9.5"
				},
				{
					name:
						"Costa Rica se asegurará que las áreas de humedales costeros estén manejadas y monitoreadas de manera efectiva, y continuará desarrollando mecanismos para continuar el aprovechamiento comunitario sostenible de áreas de manglares clave para el sustento y sostenimiento local.",
					code: "9.6"
				},
				{
					name:
						"Costa Rica aspira a detener o revertir la pérdida neta de humedales costeros para el 2030, mediante la atención a los principales causantes de la deforestación y la degradación que amenaza la propia existencia, salud y vitalidad de los humedales costeros, según el Inventario Nacional Forestal.",
					code: "9.7"
				},
				{
					name:
						"Para el 2025 y en el marco de la restauración de ecosistemas de carbono azul, Costa Rica se compromete a restaurar las áreas de humedales costeros priorizadas, según están identificadas en el plan de implementación de la Estrategia Nacional de Restauración del Paisaje, con un porcentaje adicional de área establecido por la estrategia para el 2030.",
					code: "9.8"
				},
				{
					name:
						"En el marco de la restauración de ecosistemas de carbono azul, Costa Rica se compromete a garantizar que estas las áreas de humedales costeros priorizadas se gestionen y supervisen de forma eficaz, incluso mediante la integración con los planes de gestión existentes. Costa Rica seguirá desarrollando mecanismos para permitir la gestión comunitaria sostenible de las áreas de manglares clave para el sustento y los medios de vida locales.",
					code: "9.9"
				},
				{
					name:
						"Costa Rica se compromete a explorar mecanismos innovadores de financiamiento de la conservación, incluida la expansión potencial de los modelos terrestres de Pago por Servicios de los Ecosistemas, sujeto a mejoras, para apoyar la implementación de los objetivos de carbono azul.",
					code: "9.10"
				},
				{
					name:
						"Costa Rica explorará el potencial de las inversiones público-privadas para apoyar la protección y restauración de los manglares.",
					code: "9.11"
				},
				{
					name:
						"Costa Rica se compromete a promover actividades de pesca sostenible, incluidos esquemas de maricultura, de valor agregado de la pesca artesanal y tradicional y de ordenamiento espacial marino para impulsar el desarrollo de una economía azul.",
					code: "9.12"
				}
			]
		},
		{
			name: '"0. Acción para el empoderamiento climático',
			options: [
				{
					name:
						"En los primeros dos años del período de implementación de esta contribución estará en operación una estrategia nacional para el empoderamiento climático con acciones en educación, formación, sensibilización social, acceso a la información, participación ciudadana y cooperación internacional. Esta estrategia será creada de manera inclusiva y participativa, incluyendo con los sectores de Cultura y Educación, y seguirá las mejores prácticas internacionales para su creación, incluyendo aquellas de la Convención Marco de las Naciones Unidas sobre el Cambio Climático y la Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO). Esta estrategia tendrá indicadores y métricas específicas, planteará propuestas de financiamiento, incluirá de manera central a las personas jóvenes, al Consejo Consultivo Ciudadano de Cambio Climático, a los Pueblos Indígenas y a las comunidades Afrodescendientes, cuyas cosmovisiones, tradiciones y conocimientos son invaluables para informar un desarrollo nacional verdaderamente sostenible.",
					code: "10.1"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, el país revisará los currículos de educación en primer y segundo ciclo educativo para incluir o ampliar materia sobre cambio climático, la transición justa, y el empleo verde, creará alianzas entre actores clave del sector educación formal y no formal —entre ellos el Ministerio de Educación Pública, organizaciones de sociedad civil y organizaciones comunales que tengan la capacidad de implementar programas de educación dirigidos a la ciudadanía en general— y creará un proceso con universidades públicas y privadas para incluir en sus programas o fortalecer contenidos relacionados con el cambio climático y la formación de competencias para el empleo verde con base en las exigencias profesionales previstas. Estos procesos se llevaran a cabo tomando en cuenta las perspectivas de distintos grupos, entre ellos, las personas jóvenes, los Pueblos Indígenas y personas Afrodescendientes de manera apropiada a las realidades y cosmovisiones de las distintas comunidades.",
					code: "10.2"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, el país desarrollará programas de capacitación específicos para mujeres, personas jóvenes, personas Afrodescendientes, personas indígenas y otros grupos históricamente excluidos del sector laboral, a fin de facilitar el acceso a empleos verdes, incluyendo áreas como la de la energía renovable, la agricultura regenerativa y de precisión, la construcción sostenible y la recuperación de valorizables, en las que a menudo están subrepresentados.",
					code: "10.3"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, el país habrá implementado acciones de comunicación, participación y empoderamiento de la ciudadanía para promover la integración de las perspectivas de distintos grupos, entre ellos, las personas jóvenes, los Pueblos Indígenas y personas Afrodescendientes de manera apropiada a las realidades y cosmovisiones de las distintas comunidades.",
					code: "10.4"
				},
				{
					name:
						"Al 2030, se han fortalecido las capacidades en mitigación y adaptación al cambio climático de tomadores de decisión de los diferentes niveles de gobierno, así como de líderes comunales y de las personas jóvenes de manera apropiada a las realidades y cosmovisiones de las distintas comunidades.",
					code: "10.5"
				},
				{
					name:
						"Al 2030, se habrán incorporado acciones de sensibilización y creación de capacidades para personas tomadoras de decisiones con un énfasis en el modelo de innovación de triple hélice para promover el desarrollo económico y social a través de la interacción del sector empresarial, el sector público, la academia para el desarrollo de una economía inclusiva, descarbonizada y resiliente.",
					code: "10.6"
				},
				{
					name:
						"Al 2030, se habrá impulsado la gestión y participación comunitaria en la adaptación para reducir la vulnerabilidad de las comunidades al cambio climático de manera apropiada a las realidades y cosmovisiones de las distintas comunidades.",
					code: "10.7"
				},
				{
					name:
						"Durante el período de implementación de esta contribución, el país tomará acciones de comunicación y participación ciudadana alineadas a la Estrategia Nacional de Consumo y Producción Responsable para reducir el consumismo, específicamente de productos de consumo individual con huella de carbono alta. En este esfuerzo favorecerá el conocimiento y los oficios tradicionales a través de su transferencia generacional, reconocimiento y diálogo con saberes afines.",
					code: "10.8"
				},
				{
					name:
						"A partir del 2021, el país desarrollará espacios de diálogo y participación, tanto virtuales como presenciales para grupos particularmente vulnerabilizados ante el cambio climático, incluyendo a la comunidad Afrodescendiente, grupos organizados de mujeres, juventudes, comunidad transexual, Pueblos Indígenas, personas con discapacidad y personas adultas mayores de manera apropiada y accesible a las realidades, cosmovisiones y tradiciones de las distintas comunidades y poblaciones.",
					code: "10.9"
				},
				{
					name:
						"Al 2022, el país ha generado un Plan para la Integración de las Juventudes en la Acción Climática.",
					code: "10.10"
				},
				{
					name:
						"Al 2024 se fortalecerán las estructuras para la incorporación de las juventudes y la niñez dentro de las acciones para el empoderamiento climático, incluyendo el establecimiento de un Foro Anual para Juventudes en Acción Climática como parte del eje de acción climática de la Política Pública de la Persona Joven 2020-2024.",
					code: "10.11"
				}
			]
		},
		{
			name: "11. Transparencia y mejora continua",
			options: [
				{
					name:
						"Al 2022 Costa Rica ha implementado el sistema de monitoreo para el seguimiento de los avances de la NDC, de la Política Nacional de Adaptación al Cambio Climático, la Comunicación sobre la Adaptación, el Plan Nacional de Adaptación y el Plan Nacional de Descarbonización, permitiendo el acceso a los datos de manera abierta y apropiada para las distintas comunidades y poblaciones.",
					code: "11.1"
				},
				{
					name:
						"Al 2022 Costa Rica habrá establecido procesos y arreglos institucionales que le permitan contar con una capacidad permanente de análisis, prospectiva y publicación técnica independiente en acción climática. El país hará esfuerzos específicos para hacer esta información disponible de manera apropiada a las diferentes comunidades y poblaciones.",
					code: "11.2"
				},
				{
					name:
						"Para el año 2030, el país dará seguimiento a los indicadores requeridos para garantizar la igualdad de género y el empoderamiento de la comunidad Afrodescendiente, los grupos organizados de mujeres, las juventudes, la comunidad transexual, los Pueblos Indígenas, las personas con discapacidad y las personas adultas mayores en la agenda climática en los sectores de acción.",
					code: "11.3"
				},
				{
					name:
						"Para el año 2030 el país contará con datos diferenciados sobre la realidad de los grupos históricamente excluidos y más vulnerabilizados ante los efectos del cambio climático incluyendo como mínimo a la comunidad Afrodescendiente, grupos organizados de mujeres, juventudes, comunidad transexual, Pueblos Indígenas, personas con discapacidad y personas adultas mayores.",
					code: "11.4"
				},
				{
					name:
						"Al 2030, se han habilitado plataformas que faciliten acceso a información y servicios climáticos a todo tipo de público utilizando lenguaje y ejemplos relevantes y apropiados para las diferentes realidades y cosmovisiones del país.",
					code: "11.5"
				},
				{
					name:
						"Como acción de apoyo transversal, Costa Rica dar cuenta de los flujos (emisiones y absorciones) de gases de efecto invernadero de los humedales costeros mediante la integración en el Inventario Nacional de Gases de Efecto Invernadero y la armonización con otros sistemas de Medición, Reporte y Verificación como REDD+, utilizando las guías de buenas prácticas de gases de efecto invernadero del IPCC más robusto al menos en el 2024, cuando presente el primer Informe Bienal de Transparencia, dadas las circunstancias especiales para los países en desarrollo otorgadas en virtud del Artículo 13 del Acuerdo de París para 2030.",
					code: "11.6"
				},
				{
					name:
						"Al 2030, el país, con el apoyo del Consejo Científico de Cambio Climático (4C) habrá implementado políticas para promover la investigación científica, la recolección sistemática de datos, y el análisis actual y prospectivo de información sobre riesgos, impactos, pérdidas y daños por amenazas hidrometeorológicas.",
					code: "11.7"
				},
				{
					name:
						"Al 2030, el país contará con una política de datos climáticos abiertos, tanto del sector público como privado, que facilite su generación, acceso por todo tipo de público utilizando lenguaje y ejemplos relevantes y apropiados para las diferentes realidades y cosmovisiones del país, y uso para la toma de decisiones de todos los sectores",
					code: "11.8"
				},
				{
					name:
						"Al 2030, se habrá fortalecido el conocimiento, monitoreo y respuesta de los servicios de vigilancia sanitaria en salud pública.",
					code: "11.9"
				},
				{
					name:
						"Al 2030, se habrá consolidado el Sistema Nacional de Monitoreo Forestal, incluyendo la plataforma del Sistema Nacional de Monitoreo de Cobertura y Uso de la Tierra y Ecosistemas (SIMOCUTE) y su vínculo con el Sistema Nacional de Métrica de Cambio Climático (SINAMECC) y otros sistemas nacionales de reporte ambiental y sus salvaguardas.",
					code: "11.10"
				}
			]
		},
		{
			name: "12. Finanzas",
			options: [
				{
					name:
						"12.1. Al 2030 Costa Rica habrá implementado al menos un instrumento de reforma fiscal verde consistente con la trayectoria necesaria para la descarbonización.",
					code: "12.1"
				},
				{
					name:
						"Al 2025 el país habrá desarrollado las herramientas, instrumentos, reglamentos e incentivos para acompañar al sector financiero en el análisis, revelación y gestión de los riesgos e impactos del cambio climático en su sector.",
					code: "12.2"
				},
				{
					name:
						"Movilizar el sistema financiero, incluyendo el Sistema de Banca para Desarrollo para que al 2030 existan en el mercado productos financieros en apoyo de la descarbonización y resiliencia",
					code: "12.3"
				},
				{
					name:
						"Costa Rica se compromete con fortalecer instrumentos financieros tales como pago de servicios ecosistémicos, cánones y otros instrumentos de precio al carbono, así como seguros e instrumentos tarifarios y fiscales, para financiar las necesidades de adaptación y mitigación",
					code: "12.4"
				},
				{
					name:
						"Costa Rica se compromete a identificar acciones climáticas en los ejercicios presupuestarios anuales, con el fin de contar con medidas de protección financiera ante impactos de la variabilidad y cambio climático.",
					code: "12.5"
				},
				{
					name:
						"Para el 2022 Costa Rica publicará el primer Análisis de inversión del Plan Nacional de Descarbonización y del Plan de Adaptación (aún a ser presentado), que serán actualizados cada 5 años.",
					code: "12.6"
				},
				{
					name:
						"Al 2024 se han incorporado criterios de infraestructura sostenible, descarbonizada, resiliente y que promueva la creación de empleos verdes para priorización de la inversión pública, en consonancia con el Plan Estratégico Nacional 2050.",
					code: "12.7"
				},
				{
					name:
						"Durante el periodo de ejecución de esta NDC, Costa Rica habrá desarrollado un instrumento de apoyo financiero con el sistema bancario nacional para impulsar la transición energética.",
					code: "12.8"
				},
				{
					name:
						"Al 2024 se habrá lanzado el Mecanismo de Compensación de Costa Rica (MCCR) como sucesor del Mercado Doméstico de Carbono, con el objetivo de apoyar y facilitar la movilización de fondos, principalmente nacionales, en procura de la descarbonización del país mediante la generación de Unidades Costarricenses de Compensación generados por Proyectos, Programas de Actividades o Actividades incorporadas a un Programa, que reduce o secuestra emisiones de gases de efecto invernadero en el territorio nacional.",
					code: "12.9"
				}
			]
		},
		{
			name: "13. Políticas, estrategias y planes de cambio climático",
			options: [
				{
					name:
						"En el año 2021 Costa Rica publicará la Estrategia Económica Territorial Costa Rica: hacia una economía inclusiva y descarbonizada 2020-2050 y el Plan Estratégico Nacional 2050 como instrumentos de planificación a largo plazo orientado a lograr un desarrollo económico inclusivo y descarbonizado.",
					code: "13.1"
				},
				{
					name:
						"El país se compromete a hacer las gestiones necesarias durante el periodo de implementación de esta NDC para buscar la ratificación del Acuerdo Regional sobre el Acceso a la Información, la Participación Pública y el Acceso a la Justicia en Asuntos Ambientales en América Latina y el Caribe (Acuerdo de Escazú) y las formas de implementación con normativa a nivel nacional.",
					code: "13.2"
				},
				{
					name:
						"Al 2030, el Programa Pago por Servicios Ecosistémicos, y otros instrumentos de precio al carbono e instrumentos fiscales y tarifarios, habrán desarrollado nuevos mecanismos de financiamiento para la adaptación y mitigación al cambio climático en consonancia con la Estrategia Nacional REDD+.",
					code: "13.3"
				},
				{
					name:
						"Al 2022 se habrán establecido los lineamientos y se pondrá en operación el Fondo Inclusivo de Desarrollo Sostenible con un capital semilla de 1,2 millones de dólares estadounidenses para promover el reconocimiento financiero de los espacios productivos de las mujeres rurales y su contribución a la mitigación y adaptación al cambio climático.",
					code: "13.4"
				},
				{
					name:
						"En el 2021, se iniciará la implementación de la Estrategia Nacional de Bioeconomía de Costa Rica 2020-2030 para cimentar una Costa Rica con producción sostenible de alto valor agregado en todas sus regiones y biociudades emergentes, basada en el aprovechamiento justo y equitativo de su biodiversidad, el uso circular de la biomasa y en el progreso biotecnológico del país como sociedad del conocimiento.",
					code: "13.5"
				},
				{
					name:
						"En 2021 Costa Rica habrá incorporado al Ministerio de Trabajo y Seguridad Social, Ministerio de Desarrollo Humano e Inclusión, al Ministerio de Educación Pública y al Ministerio de Cultura y Juventud al Consejo Técnico Interministerial de Cambio Climático, estableciendo agendas específicas de cooperación con cada uno.",
					code: "13.6"
				},
				{
					name:
						"Al 2022, se habrá formulado, aprobado y se ha iniciado la implementación del Plan de Acción de la Política Nacional de Adaptación al Cambio Climático (Plan Nacional de Adaptación).",
					code: "13.7"
				},
				{
					name:
						"Al 2022, se encuentra en implementación el Plan de Gestión de Riesgo de Desastres 2021-2025",
					code: "13.8"
				},
				{
					name:
						"Al 2022, se habrán elaborado, de manera participativa con los Consejos Regionales de Desarrollo y sus Comités Intersectoriales Regionales y considerando sus prioridades, planes de acción para las seis regiones socioeconómicas del país, en donde se identifiquen medidas de adaptación prioritarias para cada región, así como los arreglos institucionales necesarios para su implementación.",
					code: "13.9"
				},
				{
					name:
						"Al 2030, se han incorporado criterios y lineamientos de adaptación en los instrumentos de planificación sectorial, regional y local de ordenamiento territorial, marino y costero, a distintas escalas.",
					code: "13.10"
				},
				{
					name:
						"Costa Rica en el 2022 iniciará la implementación de su Plan de Acción de Igualdad de Género y Cambio Climático bajo el marco de la Política Nacional para la Igualdad Efectiva entre Mujeres y Hombres, el Plan Nacional de Adaptación y el Plan Nacional de Descarbonización y la Estrategia Nacional REDD+, incluyendo capacitación y fortalecimiento de capacidades respecto a la afectación diferenciada del cambio climático por condición de género a mujeres y población sexualmente diversa, en especial de poblaciones históricamente excluidas desde una perspectiva interseccional, a las instituciones que trabajan con cambio climático y particularmente para las personas tomadoras de decisiones y que trabajan directamente con la población.",
					code: "13.11"
				},
				{
					name:
						"Costa Rica continuará su posición de liderazgo en el High Ambition Coalition for People and Nature como foro estratégico para promover las sinergias entre la acción climática y la protección de la biodiversidad.",
					code: "13.12"
				},
				{
					name:
						"Costa Rica continuará su posición de liderazgo con los San Jose Principles for High Ambition and Integrity in International Carbon Markets buscando generar momentum para lograr un resultado de alta ambición para el Artículo 6 del Acuerdo de París.",
					code: "13.13"
				}
			]
		}
	];

	ejeList = [
		{
			name:
				"Desarrollo de un sistema de movilidad basado en transporte público seguro, eficiente y renovable, y en esquemas de movilidad activa.",
			options: [
				{
					name:
						"En 2035 el 30% de la flota de transporte público será cero emisiones y el Tren Eléctrico de Pasajeros operará 100% eléctrico.",
					code: "1.1"
				},
				{
					name:
						"En 2050 el sistema de transporte público (Buses, Taxis, Tren Eléctrico de Pasajeros), operará en forma integrada sustituirá al automóvil particular como la primera opción de movilidad para la población en la GAM.",
					code: "1.2"
				},
				{
					name:
						"En el 2050 el 85% de la flota de transporte público será cero emisiones.",
					code: "1.3"
				},
				{
					name:
						"En el 2050 se habrán consolidados Ciudades Compactas en principales zonas urbanas de la GAM y principales ciudades secundarias del país, con incremento de un 10% en los desplazamientos en modos no motorizados.",
					code: "1.4"
				}
			]
		},
		{
			name:
				"Transformación de la flota de vehículos ligeros a cero emisiones, nutrido de energía renovable, no de origen fósil",
			options: [
				{
					name:
						"En 2035, un 30% de la flota de vehículos ligeros - privados e institucionales será eléctrica. En 2050, el 95% de la flota - será de cero emisiones.",
					code: "2.1"
				},
				{
					name:
						"Hacia 2025 se estabilizará el crecimiento de flota de motocicletas y se adoptarán estándares para migrar a una flota cero emisiones.",
					code: "2.2"
				},
				{
					name:
						"Al 2050 se habrán consolidado nuevos modelos y esquemas de movilidad compartida.",
					code: "2.3"
				},
				{
					name:
						"Al 2050 el país contará con una extensa red de recarga eléctrica a lo largo del país y con infraestructura complementaria para tecnologías cero emisiones (ejemplo, estaciones de hidrógeno)",
					code: "2.4"
				}
			]
		}
	];

	temasList = [
		{
			name: "Transporte",
			options: [
				{ name: "Transporte público" },
				{ name: "Transporte de carga" },
				{ name: "Movilidad  sostenible" },
				{ name: "Electrificación del transporte" },
				{ name: "Tecnologías cero emisiones" },
				{ name: "Mejoramiento de Combustibles" }
			]
		},
		{
			name: "Energía",
			options: [
				{ name: "Energías renovables" },
				{ name: "Eficiencia energética" },
				{
					name: "Políticas, leyes e investigación para la transición energética"
				},
				{ name: "Mejoramiento y sustitución de combustibles " }
			]
		}
	];

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private i18nService: I18nService,
		private service: MitigationActionsService,
		private translateService: TranslateService,
		public snackBar: MatSnackBar,
		private datePipe: DatePipe
	) {
		// this.formData = new FormData();
		this.isLoading = true;
		// this.isUpdating = this.action === 'update';
		this.displayFinancialSource = false;
		this.createForm();
	}

	ngOnInit() {
		if (this.isUpdating) {
			this.service.currentMitigationAction.subscribe(message => {
				this.mitigationAction = message;
				this.updateFormData();
			});
		}
	}

	private createForm() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					// initiativeRegisterTypeCtrl: ['', Validators.required],
					initiativeTypeCtrl: ["", Validators.required],
					initiativeNameCtrl: [
						"",
						[Validators.required, Validators.maxLength(200)]
					],
					initiativeObjectiveCtrl: [
						"",
						[Validators.required, Validators.maxLength(500)]
					],
					initiativeDescriptionCtrl: [
						"",
						[Validators.required, Validators.maxLength(350)]
					],
					initiativeGoalCtrl: [
						"",
						[Validators.required, Validators.maxLength(200)]
					]
				}),
				this.formBuilder.group({
					// initiativeContactCtrl: ['', Validators.required],
					entityReportingCtrl: [
						"",
						[Validators.required, Validators.maxLength(50)]
					],
					initiativeContactNameCtrl: [
						"",
						[Validators.required, Validators.maxLength(40)]
					],
					initiativePositionCtrl: [
						"",
						[Validators.required, Validators.maxLength(40)]
					],
					initiativeEmailFormCtrl: ["", Validators.email],
					initiativePhoneCtrl: [
						"",
						Validators.compose([Validators.required, Validators.minLength(8)])
					]
				}),
				this.formBuilder.group({
					deploymentCompletionIdCtrl: ["", Validators.required],
					deploymentCompletionDateCtrl: [""],
					deploymentCompletionOtherCtrl: [""],
					initiativeStatusCtrl: ["", Validators.required],
					startImplementationCtrl: ["", Validators.required],
					deploymentCompletionCtrl: [""],
					entityResponsibleMitigationActionCtrl: [
						"",
						[Validators.required, Validators.minLength(1)]
					],
					entitiesInvolvedMitigationActionCtrl: [
						"",
						[Validators.required, Validators.minLength(1)]
					]
				}),
				this.formBuilder.group({
					geographicScaleCtrl: ["", Validators.required],
					locationActionCtrl: ["", Validators.minLength(1)]
				}),
				this.formBuilder.group({})
			])
		});
	}

	private updateFormData() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					// initiativeRegisterTypeCtrl: ['', Validators.required],
					initiativeTypeCtrl: [
						this.mitigationAction.initiative.initiative_type.id,
						Validators.required
					],
					initiativeNameCtrl: [
						this.mitigationAction.initiative.name,
						Validators.required
					],
					entityIniativeResponsibleCtrl: [
						this.mitigationAction.initiative.entity_responsible,
						Validators.required
					],
					initiativeObjectiveCtrl: [
						this.mitigationAction.initiative.objective,
						Validators.required
					],
					initiativeDescriptionCtrl: [
						this.mitigationAction.initiative.description,
						Validators.required
					],
					initiativeGoalCtrl: [
						this.mitigationAction.initiative.goal,
						Validators.required
					],
					initiativeStatusCtrl: [
						this.mitigationAction.initiative.status.id,
						Validators.required
					]
				}),
				this.formBuilder.group({
					initiativeFinancingStatusCtrl: [
						this.mitigationAction.initiative.finance.status.id,
						Validators.required
					],
					initiativeFinancingStatusTypeCtrl: [
						this.mitigationAction.initiative.finance.finance_source_type.id,
						Validators.required
					],
					initiatveFinancingSourceCtrl: this.mitigationAction.initiative.finance
						.source,
					initiativeBudgetCtrl: [
						this.mitigationAction.initiative.budget,
						Validators.required
					]
				}),
				this.formBuilder.group({
					// initiativeContactCtrl: ['', Validators.required],
					initiativeContactNameCtrl: [
						this.mitigationAction.initiative.contact.full_name,
						Validators.required
					],
					initiativePositionCtrl: [
						this.mitigationAction.initiative.contact.job_title,
						Validators.required
					],
					initiativeEmailFormCtrl: [
						this.mitigationAction.initiative.contact.email,
						Validators.email
					],
					initiativePhoneCtrl: [
						this.mitigationAction.initiative.contact.phone,
						Validators.compose([Validators.required, Validators.minLength(8)])
					]
				})
			])
		});

		this.isLoading = false;
		// this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
	}

	buildInitiativeGoal() {
		let goals = [];
		if (this.initiativeGoalList.length < 1) {
			goals.push({ goal: this.form.value.formArray[0].initiativeGoalCtrl });
		} else {
			for (let goal of this.initiativeGoalList) {
				goals.push({ goal: goal });
			}
		}

		return goals;
	}

	submitForm() {
		this.isLoading = true;

		const payload = {
			status_information: {
				status: this.form.value.formArray[2].initiativeStatusCtrl,
				start_date: this.datePipe.transform(
					this.form.value.formArray[2].startImplementationCtrl,
					"yyyy-MM-dd"
				),
				end_date: this.datePipe.transform(
					this.form.value.formArray[2].deploymentCompletionDateCtrl,
					"yyyy-MM-dd"
				),
				other_end_date:
					this.form.value.formArray[2].deploymentCompletionOtherCtrl != ""
						? this.form.value.formArray[2].deploymentCompletionOtherCtrl
						: null,
				institution: this.form.value.formArray[2]
					.entityResponsibleMitigationActionCtrl,
				other_institution: this.form.value.formArray[2]
					.entitiesInvolvedMitigationActionCtrl
			},
			geographic_location: {
				geographic_scale: this.form.value.formArray[3].geographicScaleCtrl,
				location: this.form.value.formArray[3].locationActionCtrl
			},
			initiative: {
				name: this.form.value.formArray[0].initiativeNameCtrl,
				objective: this.form.value.formArray[0].initiativeObjectiveCtrl,
				description: this.form.value.formArray[0].initiativeDescriptionCtrl,
				initiative_goal: this.buildInitiativeGoal(),
				initiative_type: this.form.value.formArray[0].initiativeTypeCtrl
			},
			contact: {
				institution: this.form.value.formArray[1].entityReportingCtrl,
				full_name: this.form.value.formArray[1].initiativeContactNameCtrl,
				job_title: this.form.value.formArray[1].initiativePositionCtrl,
				email: this.form.value.formArray[1].initiativeEmailFormCtrl,
				phone: this.form.value.formArray[1].initiativePhoneCtrl
			}
		};

		console.log(payload);

		if (this.isUpdating) {
			/*
			context.initiative["id"] = this.mitigationAction.initiative.id;
			context.initiative.contact[
				"id"
			] = this.mitigationAction.initiative.contact.id;
			context.initiative.finance[
				"id"
			] = this.mitigationAction.initiative.finance.id;
			this.service
				.submitMitigationActionUpdateForm(
					context,
					this.mitigationAction.id,
					this.i18nService.language.split("-")[0]
				)
				.pipe(
					finalize(() => {
						this.form.markAsPristine();
						this.isLoading = false;
					})
				)
				.subscribe(
					response => {
						this.translateService
							.get("Sucessfully submitted form")
							.subscribe((res: string) => {
								this.snackBar.open(res, null, { duration: 3000 });
							});
						this.wasSubmittedSuccessfully = true;
					},
					error => {
						this.translateService
							.get("Error submitting form")
							.subscribe((res: string) => {
								this.snackBar.open(res, null, { duration: 3000 });
							});
						log.debug(`New Mitigation Action Form error: ${error}`);

						this.errorComponent.parseErrors(error);
						this.error = error;
						this.wasSubmittedSuccessfully = false;
					}
				);
				*/
		} else {
			this.service
				.submitMitigationActionNewForm(payload)
				.pipe(
					finalize(() => {
						this.form.markAsPristine();
						this.isLoading = false;
					})
				)
				.subscribe(
					response => {
						this.translateService
							.get("Sucessfully submitted form")
							.subscribe((res: string) => {
								this.snackBar.open(res, null, { duration: 3000 });
							});
						this.wasSubmittedSuccessfully = true;
					},
					error => {
						this.translateService
							.get("Error submitting form")
							.subscribe((res: string) => {
								this.snackBar.open(res, null, { duration: 3000 });
							});
						log.debug(`New Mitigation Action Form error: ${error}`);
						this.errorComponent.parseErrors(error);
						this.error = error;
						this.wasSubmittedSuccessfully = false;
					}
				);
		}
	}

	financialSourceInputShown($event: any) {
		// todo: when we traslate in the backend we need to traslate this hardcoded value here
		const insuredSourceTypeId = this.processedNewFormData.finance_status
			.filter(
				financeSource =>
					financeSource.status === "Insured" ||
					financeSource.status === "Asegurado"
			)
			.map(({ id }) => id);
		this.displayFinancialSource = $event.value === insuredSourceTypeId;
	}

	removeGoal(item: string) {
		const index = this.initiativeGoalList.indexOf(item);

		if (index >= 0) {
			this.initiativeGoalList.splice(index, 1);
		}
	}

	wordCounter(text: string) {
		const words = text ? text.split(/\s+/) : 0;
		return words ? words.length : 0;
	}
}
